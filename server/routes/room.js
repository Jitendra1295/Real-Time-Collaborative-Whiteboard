// routes/auth.js

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken } = require("../middleware/authMiddleware")

router.patch('/update/:roomId', authenticateToken, roomController.update);
router.get('/data', authenticateToken, roomController.getActiveRoom);
router.post('/feedback', authenticateToken, roomController.addFeedback);

module.exports = router;
