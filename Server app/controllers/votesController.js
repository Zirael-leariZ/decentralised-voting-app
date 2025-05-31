const VoteModel = require('../models/voteModel');

const getAllVotes = async (req, res) => {
    const votes = await VoteModel.find()
    res.status(200).json({ votes, num: votes.length });
}

module.exports = {
    getAllVotes,
};