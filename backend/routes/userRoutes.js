const express = require('express');
const router = express.Router();
const {
  getUserStats
} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/me/stats', verifyToken, getUserStats);

module.exports = router;