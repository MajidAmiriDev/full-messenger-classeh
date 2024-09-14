const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectRabbitMQ, sendMessageToQueue } = require('./config/rabbitmq');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatSocket = require('./sockets/chat');

dotenv.config();
connectDB();
connectRabbitMQ();

const app = express();
const server = http.createServer(app);

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

chatSocket(server);
app.post('/send-to-queue', (req, res) => {
    const { queueName, message } = req.body;
    sendMessageToQueue(queueName, message);
    res.status(200).json({ message: 'Message sent to RabbitMQ' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));