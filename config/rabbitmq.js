const amqp = require('amqplib');

let channel;

// اتصال به RabbitMQ
const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost'); // تنظیم RabbitMQ
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
};

// ارسال پیام به صف
const sendMessageToQueue = async (queueName, message) => {
    if (!channel) {
        console.error('Channel not found, please make sure to connect to RabbitMQ');
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent to queue ${queueName}: ${message}`);
};

module.exports = { connectRabbitMQ, sendMessageToQueue };