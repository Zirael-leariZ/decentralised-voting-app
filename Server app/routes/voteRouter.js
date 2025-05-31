const express = require('express')

const router = express.Router();

//Destructuring functions from controller
const {
    getAllVotes
} = require('../controllers/votesController')

router.route('/getAll').get(getAllVotes);

module.exports = router
