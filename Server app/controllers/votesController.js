// controllers/votesController.js

const VoteModel = require('../models/voteModel');

/**
 * Fetch all votes, categorized into active and completed.
 * GET /api/v1/votes/getAll
 */
const getAllVotes = async (req, res) => {
  try {
    // Find votes with status 'active'
    const activeVotes = await VoteModel.find({ status: 'active' });
    // Find all other votes (i.e., completed or otherwise)
    const completedVotes = await VoteModel.find({ status: { $ne: 'active' } });

    res.status(200).json({
      activeVotes,
      completedVotes,
      totalActive: activeVotes.length,
      totalCompleted: completedVotes.length
    });
  } catch (err) {
    console.error('Error in getAllVotes:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * Fetch a single vote by its integer ID.
 * GET /api/v1/votes/:id
 */
const getVoteById = async (req, res) => {
  // Parse the ID parameter as an integer
  const voteId = parseInt(req.params.id, 10);

  // If the parsed ID is not a number, return 400
  if (isNaN(voteId)) {
    return res.status(400).json({ msg: 'Invalid vote ID (must be an integer)' });
  }

  try {
    // Find a vote document whose `id` field matches voteId
    const vote = await VoteModel.findOne({ id: voteId });

    if (!vote) {
      return res.status(404).json({ msg: 'Vote not found' });
    }

    res.status(200).json({ vote });
  } catch (err) {
    console.error('Error in getVoteById:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

/**
 * Create a new vote (poll) in MongoDB.
 * POST /api/v1/votes/addVote
 */
const addVote = async (req, res) => {
  const { domain, description, options, num_participants, expiration_date } = req.body;

  // Validate required fields
  if (
    !domain ||
    !description ||
    !Array.isArray(options) ||
    options.length === 0 ||
    num_participants === undefined ||
    !expiration_date
  ) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  try {
    // Create a new VoteModel instance
    const newVote = new VoteModel({
      domain,
      description,
      options,
      num_participants,
      expiration_date,
      status: 'active'
    });

    // Save it to the database
    await newVote.save();

    res.status(201).json({ msg: 'Vote created successfully', vote: newVote });
  } catch (err) {
    console.error('Error in addVote:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllVotes,
  getVoteById,
  addVote
};
