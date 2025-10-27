// Defines API routes for user management including user profile and role management endpoints.

const express = require('express');
const router = express.Router();
const { getUsers, getUserRoles, addUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', getUsers);
router.get('/roles', getUserRoles);
router.post('/', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
