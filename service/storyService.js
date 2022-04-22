/** @format */

const StorySchema = require("../model/story");
const format = require("../util/dateformat");
const logger = require("../util/logger");

module.exports = {
  async save({ title, author, description, image }) {
    const story = new StorySchema({
      title,
      author,
      description,
      image,
      createTime: format(new Date()),
      delete: false,
      rooms: 0,
    });

    logger.info(`received: ${story}`);

    try {
      const result = await story.save();
      return result._id;
    } catch (e) {
      logger.error(`received: ${e}`);
      throw new Error("Could not insert data!");
    }
  },
  async getStoryList() {
    const result = await StorySchema.find();
    return result.map((e) => ({
      id: e._id,
      author: e.author,
      createTime: e.createTime,
      description: e.description,
      image: e.image,
      rooms: e.rooms,
      title: e.title,
    }));
  },
  getStoryDetail(id) {
    if (id) {
      return StorySchema.findById(id);
    }
    throw new Error("Id should not be empty");
  },
};
