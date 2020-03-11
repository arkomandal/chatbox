const db = require('../models/index');
const ObjectId = db.ObjectId;
const authService = require('./auth.service');
const bcrypt = require('bcrypt');

exports.authenticate = (req, res, next) => {
    authService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

exports.create = async (req, res) => {
    const { user_name, phone, password } = req.body;
    const user_exists = await db.user.findOne({ "phone": phone });
    if (!user_exists) {
        const user = new db.user({
            user_name, phone, password: bcrypt.hashSync(password, 10)
        });
        await user.save();
        res.send(user);
    } else {
        res.send({ message: "duplicate" }).status(409);
    }
};

exports.findAll = async (req, res) => {
    let records = 10,
        limit = records * req.params.page,
        skip = limit - records;
    let filter = req.params.filter == 1 ? 1 : req.params.filter == 2 ? -1 : 1;
    let users = await db.user.aggregate([
        {
            $lookup:
            {
                from: "groupusers",
                localField: "_id",
                foreignField: "user_id",
                as: "group_users"
            }
        },
        {
            $match: {
                user_name: { $regex: new RegExp(req.params[0], "i") },
            }
        },
        { //selecting fields to show
            $project: {
                user_name: 1,
                phone: 1,
                group_users: "$group_users"
            }
        },
        { $sort: { user_name: filter } },
        { $limit: limit },
        { $skip: skip }
    ]);
    for (let user of users) {
        for (group of user.group_users) {
            group.group = await db.group.findById(group.group_id);
        }
    }
    const data = {
        total: await db.user.countDocuments(),
        users: users
    };
    res.send(data);
};

exports.findOne = async (req, res) => {
    let user = await db.user.aggregate([
        {
            $lookup:
            {
                from: "groupusers",
                localField: "_id",
                foreignField: "user_id",
                as: "group_users"
            }
        },
        {
            $match: {
                _id: ObjectId(req.params.userId)
            }
        },
        { //selecting fields to show
            $project: {
                user_name: 1,
                phone: 1,
                group_users: "$group_users"
            }
        }
    ]);
    for (let u of user) {
        for (group of u.group_users) {
            group.group = await db.group.findById(group.group_id);
        }
    }
    res.send(user);
};

exports.update = async (req, res) => {
    let user = await db.user.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.send(user);
};

exports.delete = async (req, res) => {
    let user = await db.user.findByIdAndRemove(req.params.userId);
    res.send(user)
};