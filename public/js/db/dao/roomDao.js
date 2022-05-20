/**
 * @@desc  Different methods for room in IndexedDB.
 * @format
 */

import { db, STORY_STORE_NAME } from "/js/db/database.js";
import storyDao from "/js/db/dao/storyDao.js";

class roomDao {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get room detail data from indexDB
   * @param id
   * @returns {Promise<{storyId, roomDescription, imageUrl: *, storyTitle, roomCreateTime: (string|*), roomMembers: *, roomId, roomName}>}
   */
  async getRoomDetail(id) {
    const stories = await storyDao.getStoryList();
    const roomList = stories.flatMap((e) => e.roomList);
    const room = roomList.find((e) => e.id == id);
    const story = stories.find((e) => e.id == room.storyId);
    return {
      imageUrl: story.image,
      roomCreateTime: room.createTime,
      roomDescription: room.description,
      roomId: room.id,
      roomMembers: room.members,
      roomName: room.name,
      storyId: story.id,
      storyTitle: story.title,
    };
  }

  async updateRoomList(object) {
    const story = await storyDao.getStoryDetail(object.storyId);
    story.roomList.push({
      createTime: object.createTime,
      description: object.description,
      id: object._id,
      members: 0,
      name: object.name,
      storyId: object.storyId,
    });
  }
}

export default new roomDao(db);
