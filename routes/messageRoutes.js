const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// مسیر برای ارسال پیام به گروه
router.post('/send', authMiddleware, sendMessage);

// مسیر برای دریافت پیام‌های گروه
router.get('/messages', authMiddleware, getMessages);

module.exports = router;