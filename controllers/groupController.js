const Group = require('../models/groupModel');
const User = require('../models/User');

exports.getUserGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id });
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// ایجاد گروه جدید
exports.createGroup = async (req, res) => {

    const { name } = req.body;
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const group = new Group({
            name,
            owner: req.user.id,  // اطمینان از درست بودن این مقدار
            members: [req.user.id],
        });

        await group.save();
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// اضافه کردن کاربر به گروه
exports.addMemberToGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    const group = await Group.findById(groupId);
    console.log(userId)

    try {

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ error: 'User already in group' });
        }
        group.members.push(req.user);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }

};