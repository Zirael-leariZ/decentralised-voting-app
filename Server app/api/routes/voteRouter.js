const express = require('express');
const router = express.Router();
const { factory, verifier, faucet } = require('../utils/contracts');  // Connect to smart contracts
const mongoose = require('mongoose');
const Poll = require('../models/voteModel');  // Model for voting polls

// 1. The route for creating a new voting round
router.post('/create', async (req, res) => {
  const { name, domain, options, duration, quorum, sponsor } = req.body;

  try {
    // Create a new voting round using the factory contract
    const tx = await factory.createVotingRound(name, domain, options, duration, quorum, sponsor);
    const receipt = await tx.wait();

    // Logic to save the voting round in the database
    const poll = new Poll({
      description: name,
      domain: domain,
      options: options,
      expiration_date: new Date(Date.now() + duration * 1000), // Convert duration to milliseconds
      status: 'active',
      sponsor: sponsor,
      total_votes: 0,
      winner: '',
      winning_percentage: 0,
    });

    await poll.save();  // save the poll to the database

    // retrieve the round ID and address from the transaction receipt
    const event = receipt.events?.find(log => log.fragment.name === 'NewRound');
    const roundId = event?.args?.roundId.toString();
    const roundAddress = event?.args?.roundAddress;

    res.status(201).json({ roundId, roundAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create voting' });
  }
});

// 2. The route for casting a vote in a voting round
router.post('/:pollId/vote', async (req, res) => {
  const { pollId } = req.params;
  const { option } = req.body;

  try {
    // take the poll from the database
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Receving the poll expiration date
    const votingRound = new ethers.Contract(poll.contract_address, poll.contract_abi, verifier);

    // interact with the voting contract to cast a vote
    const tx = await votingRound.vote(option);
    const receipt = await tx.wait();

    // Update the poll in the database
    poll.total_votes += 1;
    await poll.save();

    res.status(200).json({ message: 'Vote successfully casted', receipt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// 3. Roote for fetching the results of a voting round
router.get('/:pollId/results', async (req, res) => {
  const { pollId } = req.params;

  try {
    // Retrieve the poll from the database
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if the voting has ended
    if (new Date(poll.expiration_date) > Date.now()) {
      return res.status(400).json({ error: 'Voting has not ended yet' });
    }

    // Receive the results from the voting contract
    const votingRound = new ethers.Contract(poll.contract_address, poll.contract_abi, verifier);
    const results = await votingRound.getResults();

    // Counting the results
    const winner = results[0]; // could be changed to a more complex logic if needed
    const totalVotes = results[1];
    const winningPercentage = (results[2] / totalVotes) * 100;

    // Update the poll with the results
    poll.winner = winner;
    poll.winning_percentage = winningPercentage;
    poll.status = 'completed';  // Update the status of the poll
    await poll.save();

    // return the results
    res.status(200).json({ winner, winning_percentage: winningPercentage, total_votes: totalVotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
