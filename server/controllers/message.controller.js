const db = require('../models/index');
const ObjectId = db.ObjectId; //it is assigned in models/index

exports.create = async (req, res) => {
    const message = new db.message(req.body);
    await message.save();
    res.send(message);
};

exports.findAll = async (req, res) => {
    const { sender, receiver_type, receiver, page, filter } = req.params;
    let records = 10,
        limit = records * page,
        skip = limit - records;
    let order = filter == 1 ? 1 : filter == 2 ? -1 : 1;
    if (receiver_type == 2) {
        let messages = await db.message.aggregate([
            {
                $lookup:
                {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $match: {
                    message: { $regex: new RegExp(req.params[0], "i") }, //where. i for ignore case
                    receiver_type: receiver_type,
                    receiver: ObjectId(receiver)
                }
            },
            { $sort: { createdAt: order } },
            { $limit: limit },
            { $skip: skip }
        ]);
        const data = {
            total: await db.message.count(),
            messages: messages.map(msg => {
                return { message: msg.message, sender: msg.sender[0].user_name, time: msg.createdAt };
            })
        };
        res.send(data);
    }
};

exports.findOne = async (req, res) => {
    let message = await db.message.findById(req.params.messageId);
    res.send(message);
};

exports.update = async (req, res) => {
    let message = await db.message.findByIdAndUpdate(req.params.messageId, req.body, { new: true });
    res.send(message);
};

exports.delete = async (req, res) => {
    let message = await db.message.findByIdAndRemove(req.params.messageId);
    res.send(message)
};