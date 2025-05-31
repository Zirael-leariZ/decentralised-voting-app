const express = require('express')

const router = express.Router();

//Destructuring functions from controller
const {
    getAllVotes,
    getVoteById,
    addVote
} = require('../controllers/votesController')

router.route('/getAll').get(getAllVotes);
router.get('/vote/:id', getVoteById);
router.post('/addVote', addVote);

module.exports = router
