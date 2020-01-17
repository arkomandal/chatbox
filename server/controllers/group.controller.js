const db = require('../models/index');

exports.create = async (req, res) => {
    const group = new db.group(req.body);
    await group.save();
    for (let user_id of req.body.users) {
        const group_user = new db.group_user({ group_id: group._id, user_id: user_id });
        await group_user.save();
    }
    res.send(group);
};

exports.findAll = async (req, res) => {
    let records = 2,
        limit = records * req.params.page,
        skip = limit - records;
    let filter = req.params.filter == 1 ? 1 : req.params.filter == 2 ? -1 : 1;
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
        { $match: { group_name: { $regex: new RegExp(req.params[0], "i") } } },
        { //selecting fields to show
            $project: {
                group_name: 1,
                group_users: "$group_users"
            }
        },
        { $sort: { group_name: filter } },
        { $limit: limit },
        { $skip: skip }
    ]);
    for(let group of groups){
        for(user of group.group_users){
            user.user = await db.user.findById(user.user_id);
        }
    }
    res.send(groups)
};

exports.findOne = async (req, res) => {
    let group = await db.group.findById(req.params.groupId);
    res.send(group);
};

exports.update = async (req, res) => {
    let group = await db.group.findByIdAndUpdate(req.params.groupId, req.body, { new: true });
    res.send(group);
};

exports.delete = async (req, res) => {
    let group = await db.group.findByIdAndRemove(req.params.groupId);
    res.send(group)
};