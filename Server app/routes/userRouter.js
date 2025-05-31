const express = require('express')
const { body } = require('express-validator');

const router = express.Router();

//Destructuring functions from controller
const {
    getAllUsers,
    loginUser,
    registerUser
} = require('../controllers/usersController')

router.route('/getAll').get(getAllUsers);
router.route('/register').post(
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    registerUser
);
router.route('/login').post(
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    loginUser
);

module.exports = router
