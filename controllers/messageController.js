const Message = require('../models/messageModel');
const Group = require('../models/groupModel');
const admin = require('../utils/firebase');
// ارسال پیام به گروه
exports.sendMessage = async (req, res) => {
    const { groupId, text } = req.body;

    try {
        // بررسی وجود گروه
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        // بررسی عضویت کاربر در گروه
        if (!group.members.includes(req.user.id)) {
            return res.status(403).json({ msg: 'You are not a member of this group' });
        }

        const message = new Message({
            group: groupId,
            sender: req.user.id,
            text,
        });

        const tokens = group.members.map(member => member.fcmToken); // فرض بر این است که هر کاربر `fcmToken` دارد
        const notification = {
            notification: {
                title: `New message from ${sender}`,
                body: content,
            },
            tokens: tokens,
        };


        const sendNotification = async (token, message) => {
            const payload = {
                notification: {
                    title: 'New Message',
                    body: message,
                },
                token: token,
            };

            try {
                const response = await admin.messaging().send(payload);
                console.log('Successfully sent message:', response);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        };



        await message.save();
        res.json(message);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// دریافت پیام‌های گروه
exports.getMessages = async (req, res) => {
    const { groupId } = req.query;

    try {
        // بررسی وجود گروه
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        // بررسی عضویت کاربر در گروه
        if (!group.members.includes(req.user.id)) {
            return res.status(403).json({ msg: 'You are not a member of this group' });
        }

        const messages = await Message.find({ group: groupId }).populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};