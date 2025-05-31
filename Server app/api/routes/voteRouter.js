// routes/voteRouter.js
const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

const { factory, verifier } = require('../utils/contracts');  // Helpers to get preconfigured contract instances
const Poll = require('../models/voteModel');

// 1. Create a new voting round
router.post('/create', async (req, res) => {
  const { name, domain, options, duration, quorum, sponsor } = req.body;

  try {
    // 1a) Call your Factory contract to create a new round on-chain
    const tx = await factory.createVotingRound(name, domain, options, duration, quorum, sponsor);
    const receipt = await tx.wait();

    // 1b) Persist a new Poll document in MongoDB
    const event = receipt.events.find(log => log.fragment.name === 'NewRound');
    const roundAddress = event?.args?.roundAddress || null;

    const poll = new Poll({
      description: name,
      domain,
      options,
      expiration_date: new Date(Date.now() + duration * 1000),
      status: 'active',
      sponsor,
      total_votes: 0,
      winner: '',
      winning_percentage: 0,
      contract_address: roundAddress,
      contract_abi: factory.interface.format() // store the ABI if you want to read it later
    });
    await poll.save();

    // 1c) Extract the on-chain roundId and roundAddress from the “NewRound” event
    const roundId = event.args.roundId.toString();

    return res.status(201).json({ roundId, roundAddress });
  } catch (error) {
    console.error('Error in /create:', error);
    return res.status(500).json({ error: 'Failed to create voting round' });
  }
});

// 2. Cast a vote in an existing voting round
router.post('/:pollId/vote', async (req, res) => {
  const { pollId } = req.params;
  const { option } = req.body;

  try {
    // 2a) Fetch the poll from MongoDB
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // 2b) Instantiate the on-chain voting contract with its saved address/ABI
    const votingRound = new ethers.Contract(
      poll.contract_address,
      poll.contract_abi,
      verifier
    );

    // 2c) Submit the vote on-chain
    const tx = await votingRound.vote(option);
    const receipt = await tx.wait();

    // 2d) Update the “total_votes” counter in MongoDB
    poll.total_votes += 1;
    await poll.save();

    return res.status(200).json({ message: 'Vote successfully casted', receipt });
  } catch (error) {
    console.error(`Error in /${pollId}/vote:`, error);
    return res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// 3. Retrieve voting results for a completed round
router.get('/:pollId/results', async (req, res) => {
  const { pollId } = req.params;

  try {
    // 3a) Fetch the poll from MongoDB
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // 3b) If voting has not yet expired, block the request
    if (new Date(poll.expiration_date) > Date.now()) {
      return res.status(400).json({ error: 'Voting has not ended yet' });
    }

    // 3c) Instantiate the on-chain voting contract again
    const votingRound = new ethers.Contract(
      poll.contract_address,
      poll.contract_abi,
      verifier
    );

    // 3d) Call getResults() on-chain
    const [winner, totalVotesBigNumber, winnerVoteCountBigNumber] = await votingRound.getResults();
    const totalVotes = totalVotesBigNumber.toNumber();
    const winnerVoteCount = winnerVoteCountBigNumber.toNumber();
    const winningPercentage = totalVotes > 0
      ? Math.floor((winnerVoteCount * 100) / totalVotes)
      : 0;

    // 3e) Update MongoDB document fields
    poll.winner = winner;
    poll.winning_percentage = winningPercentage;
    poll.status = 'completed';
    await poll.save();

    return res.status(200).json({
      winner,
      winning_percentage: winningPercentage,
      total_votes: totalVotes
    });
  } catch (error) {
    console.error(`Error in /${pollId}/results:`, error);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
