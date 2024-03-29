/** @format */

const StorySchema = require("../model/story");
const logger = require("../util/logger");
const Exception = require("../util/exception");
const { BAD_REQUEST, ERROR_PAGE, SERVER_ERROR } = require("../util/http");
const storyService = require("../service/roomService");

const convertToVO = async (list) => {
  const rest = [];

  for (const e of list) {
    const roomList = await storyService.getRoomList(e._id);
    rest.push({
      id: e._id,
      author: e.author,
      createTime: e.createTime,
      description: e.description,
      image: e.image,
      rooms: e.rooms,
      title: e.title,
      offline: e.offline,
      roomList,
    });
  }
  return rest;
};

module.exports = {
  async save({ title, author, description, image, createTime }) {
    if (!createTime) {
      createTime = new Date();
    }
    const story = new StorySchema({
      title,
      author,
      description,
      image,
      createTime,
      rooms: 0,
      offline: 0,
    });

    try {
      const result = await story.save();
      return {
        id: result._id,
        author: result.author,
        createTime: result.createTime,
        description: result.description,
        image: result.image,
        rooms: result.rooms,
        title: result.title,
        offline: result.offline,
      };
    } catch (e) {
      logger.error(`received: ${e}`);
      throw new Exception(SERVER_ERROR.code, "Story cannot be created");
    }
  },
  async getStoryList() {
    try {
      const result = await StorySchema.find().sort({ createTime: "desc" });
      return await convertToVO(result);
    } catch (e) {
      throw new Exception(ERROR_PAGE.code, "Story List cannot be found");
    }
  },
  async getStoryDetail(id) {
    if (id) {
      try {
        const data = await StorySchema.findById(id);
        const roomList = await storyService.getRoomList(id);

        return {
          ...data._doc,
          roomList,
        };
      } catch (e) {
        throw new Exception(ERROR_PAGE.code, "Story cannot be found");
      }
    }

    throw new Exception(
      BAD_REQUEST.code,
      BAD_REQUEST.message("Id should not be empty"),
    );
  },
  async uploadOfflineList(list) {
    if (list.length <= 0) {
      throw new Exception(
        BAD_REQUEST.code,
        BAD_REQUEST.message("list should not be empty!"),
      );
    }

    try {
      await StorySchema.insertMany(list);
    } catch (e) {
      throw new Exception(
        SERVER_ERROR.code,
        BAD_REQUEST.message("upload error"),
      );
    }
  },
};
