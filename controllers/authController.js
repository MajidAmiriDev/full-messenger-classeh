const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMessageToQueue } = require('../config/rabbitmq');


exports.requestOtp = async (req, res) => {
    const { mobile } = req.body;
    console.log(mobile);
    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const lastRequestTime = await redisClient.get(`lastOtpRequest:${mobile}`);
        const currentTime = Date.now();

        if (lastRequestTime && currentTime - lastRequestTime < 2 * 60 * 1000) {
            return res.status(400).json({ message: 'You can request a new OTP after 2 minutes.' });
        }

        let otp = await redisClient.get(`otp:${mobile}`);

        if (!otp) {
            otp = Math.floor(100000 + Math.random() * 900000); // کد ۶ رقمی

            await redisClient.setEx(`otp:${mobile}`, 600, otp);
        }

        await redisClient.setEx(`lastOtpRequest:${mobile}`, 120, currentTime.toString());

        await sendOTP(mobile, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const storedOtp = await redisClient.get(`otp:${mobile}`);
        if (!storedOtp) return res.status(400).json({ message: 'OTP expired or invalid' });

        if (storedOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        const user = await User.findOne({ mobile });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};




exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, password: await bcrypt.hash(password, 10) });
        await user.save();
        sendMessageToQueue('user_registration', JSON.stringify({ username }));
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username)
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};