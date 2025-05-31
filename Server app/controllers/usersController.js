const { validationResult } = require('express-validator');
const { hashPassword, comparePasswords, generateToken } = require('../utilities/loginUtilities');
const UserModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
    const users = await UserModel.find()
    res.status(200).json({ users, num: users.length });
}

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if (user) 
            return res.status(400).json({ msg: 'User already exists' });
        const hashedPassword = await hashPassword(password);
        user = new UserModel({ email, password: hashedPassword });
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({ token, user: { id: user._id, email }});
    } catch (err) {
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, email } });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};