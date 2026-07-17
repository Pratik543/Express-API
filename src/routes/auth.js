/**
 * Authentication routes
 */

const express = require('express');
const router = express.Router();
const { login, logout, getCurrentUser } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

module.exports = router;
