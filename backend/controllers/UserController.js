// src/controllers/UserController.js
const UserModel = require('../models/UserModel');

const UserController = {
  register: async (req, res) => {
    const user = await UserModel.createUser(req.body);
    res.status(201).json(user);
  },

  login: async (req, res) => {
    const user = await UserModel.findUserByEmail(req.body.email);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      // Add your authentication logic here
      res.status(200).send('User logged in successfully');
    }
  }
};

module.exports = UserController;
