const express = require('express');
const router = express.Router();
const { factory } = require('../util/contracts');

router.post('/create', async (req, res) => {
  try {
    const { name, domain, options, duration, quorum, sponsor } = req.body;

    const tx = await factory.createVotingRound(name, domain, options, duration, quorum, sponsor);
    const receipt = await tx.wait();

    const roundCreated = receipt.events?.find(e => e.event === 'NewRound');
    const roundId = roundCreated.args.roundId.toString();
    const roundAddress = roundCreated.args.roundAddress;

    res.status(201).json({ roundId, roundAddress });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Contract call failed', details: e.message });
  }
});
