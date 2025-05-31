const express = require('express')
const router = express.Router()

//Destructuring functions from controller
const {
    getAllUsers
} = require('../controllers/usersController')

router.route('/getAll').get(getAllUsers);

module.exports = router
