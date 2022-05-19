/**
 * @desc: Here is the schema for room in MongoDB
 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const room = new Schema({
    storyId: { type: String, required: true },
    name: { type: String, required: true, max: 20 },
    description: { type: String, required: false, max: 100 },
    createTime: { type: String, required: true },
    delete: { type: Boolean, required: true },
    members: { type: Number, required: true },
});

room.set("toObject", { getters: true, virtuals: true });

module.exports = mongoose.model("room", room);
