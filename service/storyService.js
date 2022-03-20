/** @format */

let Story = require("../model/story");
const format = require("../util/dateformat");

module.exports = {
  async save({ title, author, description, image }) {
    const story = new Story({
      title,
      author,
      description,
      image,
      createTime:format(new Date()),
      delete: false,
    });
    console.log("received: " + story);
    try {
      const result = await story.save();
      console.log(`insert new story : ${result._id}`);
      return result._id;
    } catch (e) {
      console.error(e);
      throw new Error("Could not insert data!");
    }
  },
};
