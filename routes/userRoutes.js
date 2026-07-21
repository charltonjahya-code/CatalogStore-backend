const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');   // ← require it here

router.get('/profile', authMiddleware, userController.getProfile);   // ← middleware in the middle

module.exports = router;