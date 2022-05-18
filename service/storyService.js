/** @format */

const StorySchema = require("../model/story");
const format = require("../util/dateformat");
const logger = require("../util/logger");
const Exception = require("../util/exception");
const { BAD_REQUEST, ERROR_PAGE, SERVER_ERROR} = require("../util/http");

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
      throw new Exception(SERVER_ERROR.code, "Story cannot be created");
    }
  },
  async getStoryList() {
    try{
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
    }catch (e) {
      throw new Exception(ERROR_PAGE.code, "Story List cannot be found");
    }
  },
  async getStoryDetail(id) {
    if (id) {
      try {
        return await StorySchema.findById(id);
      } catch (e) {
        throw new Exception(ERROR_PAGE.code, "Story cannot be found");
      }
    }

    throw new Exception(
      BAD_REQUEST.code,
      BAD_REQUEST.message("Id should not be empty"),
    );
  },
};
