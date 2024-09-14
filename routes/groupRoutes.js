const express = require('express');
const router = express.Router();
const { createGroup, addMemberToGroup,getUserGroups } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');


// مسیر برای ایجاد گروه جدید
router.post('/create', authMiddleware, createGroup);

// مسیر برای اضافه کردن کاربر به گروه
router.post('/add-member', authMiddleware, addMemberToGroup);
// مسیر برای دریافت گروه‌های کاربر
router.get('/user-groups', authMiddleware, getUserGroups);


router.post('/add-user', authMiddleware, addMemberToGroup);

module.exports = router;