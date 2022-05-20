/** @format */

import { db, STORY_STORE_NAME } from "/js/db/database.js";
import storyDao from "/js/db/dao/storyDao.js";

class roomDao {
  constructor(db) {
    this.db = db;
  }

  async getRoomDetail(id) {
    debugger;
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
      storyTitle: story.title
    };
  }
}

export default new roomDao(db);
