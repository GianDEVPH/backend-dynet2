// Manages user data operations including user profiles, role management, and user information updates.

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const ROLES_LIST = require('../seeders/data/roles_list'); 
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password, roles, color } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRoles = {};
  roles.forEach(role => {
    userRoles[role] = ROLES_LIST[role];
  });
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    roles: userRoles,
color: color || '#3498db',
    refreshToken: ''
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      color: user.color,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});
const getUserRoles = asyncHandler(async (req, res) => {
  const roles = Object.keys(ROLES_LIST).map(role => ({
    role,
    value: ROLES_LIST[role]
  }));
  res.json(roles);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, roles, color } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  if (roles) {
    const userRoles = {};
    roles.forEach(role => {
      userRoles[role] = ROLES_LIST[role];
    });
    user.roles = userRoles;
  }
  if (color) user.color = color;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    roles: updatedUser.roles,
    color: updatedUser.color,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted successfully' });
});

module.exports = { getUsers, getUserRoles, addUser, updateUser, deleteUser };
