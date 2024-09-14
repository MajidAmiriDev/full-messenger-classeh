const Message = require('../models/messageModel');
const Group = require('../models/groupModel');

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