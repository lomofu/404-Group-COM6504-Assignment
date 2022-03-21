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
  getStoryList() {
    return StorySchema.find();
  },
};
