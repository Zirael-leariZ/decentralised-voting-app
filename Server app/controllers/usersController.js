const UserModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
    const users = await UserModel.find()
    res.status(200).json({ users, num: users.length });
}

module.exports = {
    getAllUsers
};
