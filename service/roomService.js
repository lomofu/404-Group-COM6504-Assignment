/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/23
 */

const RoomSchema = require("../model/room");
const StorySchema = require("../model/story");
const format = require("../util/dateformat");
const logger = require("../util/logger");

module.exports = {
  async save({ storyId, name, description }) {
    const room = new RoomSchema({
      storyId,
      name,
      description,
      createTime: format(new Date()),
      delete: false,
      members: 0,
    });

    logger.info(`received: ${room}`);

    try {
      const result = await room.save();
      const story = await StorySchema.findById(storyId);
      story.rooms += 1;
      await story.save();
      return result._id;
    } catch (e) {
      logger.error(`received: ${e}`);
      throw new Error("Could not insert data!");
    }
  },
  async getRoomList(storyId) {
    const result = await RoomSchema.find({ storyId: storyId });
    return result.map((e) => ({
      id: e._id,
      storyId: e.storyId,
      name: e.name,
      description: e.description,
      createTime: e.createTime,
      members: e.members,
    }));
  },
  async getRoomDetail(id) {
    if (id) {
      const result = await RoomSchema.findById(id);
      return {
        id: result._id,
        storyId: result.storyId,
        name: result.name,
        description: result.description,
        createTime: result.createTime,
        delete: result.delete,
        members: result.members,
      };
    }
    throw new Error({
      code: 400,
      message: "Id should not be empty",
    });
  },
  async updateRoomMemberNum(id, num) {
    try {
      return await RoomSchema.findByIdAndUpdate(id, {"members": num});
    } catch (e) {
      logger.error(`received: ${e}`);
      throw new Error("Could not insert data!");
    }
  },
};
