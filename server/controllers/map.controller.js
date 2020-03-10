const db = require('../models/index');
const ObjectId = db.ObjectId; //it is assigned in models/index

exports.addUserToGroup = async (req, res) => {
    const group_user = new db.group_user(req.body);
    await group_user.save();
    res.send(group_user);
};

exports.removeUserFromGroup = async (req, res) => {
    const { groupId, userId } = req.params;
    const data = await db.group_user.findOneAndRemove({ group_id: groupId, user_id: userId });
    res.send(data);
}

exports.usersByGroup = async (req, res) => {
    const { groupId } = req.params;
    let groups = await db.group.aggregate([
        {
            $lookup:
            {
                from: "groupusers",
                localField: "_id",
                foreignField: "group_id",
                as: "group_users"
            }
        },
        { $match: { _id: ObjectId(groupId) } }
    ]);
    for (let group of groups) {
        for (user of group.group_users) {
            user.user = await db.user.findById(user.user_id);
        }
    }
    let users_added = groups[0].group_users.map(el => {
        return ObjectId(el.user_id);
    });
    let users_not_added = await db.user.find({ "_id": { "$nin": users_added } })
    res.send({
        users_not_added
    })
}