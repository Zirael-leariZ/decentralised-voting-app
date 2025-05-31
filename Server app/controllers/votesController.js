const VoteModel = require('../models/voteModel');

const getAllVotes = async (req, res) => {
    try {
        const activeVotes = await VoteModel.find({ status: 'active' });
        const finishedVotes = await VoteModel.find({ status: { $ne: 'active' } });

        res.status(200).json({
            activeVotes,
            finishedVotes,
            totalActive: activeVotes.length,
            totalFinished: finishedVotes.length
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getVoteById = async (req, res) => {
    const voteId = parseInt(req.params.id, 10);

    if (isNaN(voteId)) {
        return res.status(400).json({ msg: 'Invalid vote ID (must be an integer)' });
    }

    try {
        const vote = await VoteModel.findOne({ id: voteId });

        if (!vote) {
            return res.status(404).json({ msg: 'Vote not found' });
        }

        res.status(200).json({ vote });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


const addVote = async (req, res) => {
    const { domain, description, option, num_participants } = req.body;

    if (!domain || !description || !option || num_participants === undefined) {
        return res.status(400).json({ msg: 'Please provide all required fields.' });
    }

    try {
        const newVote = new VoteModel({
            domain,
            description,
            option,
            num_participants,
            status: 'active'
        });

        await newVote.save();

        res.status(201).json({ msg: 'Vote created successfully', vote: newVote });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = {
    getAllVotes,
    getVoteById,
    addVote
};