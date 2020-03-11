const db = require('../models/index');
const ObjectId = db.ObjectId; //it is assigned in models/index

exports.addUserToGroup = async (req, res) => {
    const { group_id, user_id } = req.body;
    let data = [];
    for await (let user of user_id) {
        data.push({ group_id, user_id: user });
        const group_user = new db.group_user({ group_id, user_id: user });
        await group_user.save();
    }
    res.send(data);
};

exports.removeUserFromGroup = async (req, res) => {
    const { groupId, userId } = req.params;
    const data = await db.group_user.findOneAndRemove({ group_id: groupId, user_id: userId });
    res.send(data);
}

exports.usersByGroup = async (req, res) => {
    let usersByAGroup = await db.group.aggregate([
        {
            $lookup:
            {
                from: "groupusers",
                localField: "_id",
                foreignField: "group_id",
                as: "group_users"
            }
        },
        { $match: { _id: ObjectId(req.params.groupId) } }
    ]);
    let users_added = usersByAGroup[0].group_users.map(el => {
        return el.user_id.toString();
    });
    let users = await db.user.aggregate([{ $match: {} }]);
    users = users.map(user => {
        return users_added.includes(user._id.toString()) ?
            { ...user, checked: true, disabled: true } :
            { ...user, checked: false, disabled: false };
    });
    res.send(users);
}