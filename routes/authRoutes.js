const express = require('express');
const { register, login,requestOtp, verifyOtp } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOtp); // مسیر درخواست OTP
router.post('/verify-otp', verifyOtp);
module.exports = router;