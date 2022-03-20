/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const story = new Schema({
  title: { type: String, required: true, max: 100 },
  author: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  image: { type: String, required: true, max: 100 },
  createTime: { type: String, required: true },
  delete: { type: Boolean, required: true },
});

story.set("toObject", { getters: true, virtuals: true });

module.exports = mongoose.model("story", story);
