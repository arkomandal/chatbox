const db = require('../models/index');
const ObjectId = db.ObjectId; //it is assigned in models/index

exports.create = async (req, res) => {
    const message = new db.message(req.body);
    await message.save();
    res.send(message);
};

exports.findAll = async (req, res) => {
    try {
        const { page, filter } = req.params;
        const { receiver_type, receiver, sender } = req.query;
        let records = 10,
            limit = records * page,
            skip = limit - records;
        let order = filter == 1 ? 1 : filter == 2 ? -1 : 1;
        let condition;
        if (sender == "" && receiver_type == 2) { //group chat
            condition = {
                message: { $regex: new RegExp(req.params[0], "i") }, //where. i for ignore case
                receiver_type: receiver_type,
                receiver: ObjectId(receiver)
            };
        } else { //one to one chat
            condition = {
                $and: [
                    { message: { $regex: new RegExp(req.params[0], "i") } },
                    { receiver_type: receiver_type },
                    {
                        $or: [
                            { receiver: ObjectId(receiver), sender: ObjectId(sender) },
                            { receiver: ObjectId(sender), sender: ObjectId(receiver) }
                        ]
                    }
                ]
            };
        }
        let messages = await db.message.aggregate([
            {
                $match: condition
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            { $sort: { createdAt: order } },
            { $limit: limit },
            { $skip: skip }
        ]);
        const data = {
            total: await db.message.countDocuments(condition),
            messages: messages.map(msg => {
                return { message: msg.message, sender: msg.sender[0].user_name, senderId: msg.sender[0]._id, time: msg.createdAt };
            })
        };
        res.send(data);
    }
    catch (err) {
        console.log(err);
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