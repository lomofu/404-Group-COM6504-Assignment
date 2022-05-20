/**
 * @format
 * @desc Here contains all the api for room and story
 */
import http from "/js/util/http.js";
import { useDao } from "/js/db/dao.js";

export const story = {
  /**
   * Sync story list with indexDB
   * @returns {Promise<{syncTime: string, data: (Promise<*>|Promise<*|undefined>|*)}>}
   */
  async syncStoryList() {
    const { storyDao } = await useDao();
    // online sync the latest stories
    let lastSyncTime = window.localStorage.getItem("lastSyncTime");

    if (!lastSyncTime) {
      lastSyncTime = new Date().toISOString();
      window.localStorage.setItem("lastSyncTime", lastSyncTime);
    }
    // offline directly read from the indexDB
    if (!navigator.onLine) {
      return {
        syncTime: lastSyncTime,
        data: await storyDao.getStoryList(),
      };
    }

    let data;
    try {
      // fetch all stories
      const res = await http.get("api/story/list");
      data = res.data;

      // update the sync time flag
      lastSyncTime = new Date().toISOString();
      window.localStorage.setItem("lastSyncTime", lastSyncTime);
    } catch (e) {
      // return the old data;
      return {
        syncTime: lastSyncTime,
        data: await storyDao.getStoryList(),
      };
    }
    // sync into indexDB
    await storyDao.storeStoryList(data);
    return {
      syncTime: lastSyncTime,
      data,
    };
  },

  /**
   * Create story with story data
   * @param title
   * @param author
   * @param description
   * @param image
   * @returns {*}
   */
  createStory({ title, author, description, image }) {
    return http.post(
      "api/story",
      {
        title,
        author,
        description,
        image,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        maxContentLength: 100000000,
        maxBodyLength: 1000000000,
      },
    );
  },

  /**
   * Get story detail by story id
   * @param id
   * @returns {Promise<{data: (Promise<{data: *}|*|{data: *}|undefined>|Promise<(*&{roomList: *})|undefined>|Promise<*>|*)}|*>}
   */
  async getStoryDetail(id) {
    const { storyDao } = await useDao();
    // offline directly read from the indexDB
    if (!navigator.onLine) {
      return {
        data: await storyDao.getStoryDetail(id),
      };
    }
    try {
      return await http.get("api/story", {
        params: {
          id,
        },
      });
    } catch (e) {
      return {
        data: await storyDao.getStoryDetail(id),
      };
    }
  },

  /**
   * Update offline story list after online
   * @param list
   * @returns {Promise<void>}
   */
  async updateOfflineStoryList(list) {
    try {
      const { storyDao } = await useDao();
      await http.post("api/story/offlineList", list);

      await storyDao.deleteOfflineStoryList();
    } catch (e) {
      //ignore
    }
  },
};

export const room = {
  /**
   * Get room list by story id (deprecated)
   * @param storyId
   * @returns {Promise<*|{data: (Promise<{data: (Promise<{data: *}|*|undefined>|Promise<*|undefined>|Promise<*>|*)}|*>|Promise<*>|Promise<(*&{roomList: *})|undefined>|*)}>}
   */
  async getRoomList(storyId) {
    const { roomDao } = await useDao();
    // offline directly read from the indexDB
    if (!navigator.onLine) {
      return {
        data: await storyDao.getStoryDetail(id),
      };
    }
    try {
      return await http.get("api/story", {
        params: {
          id,
        },
      });
    } catch (e) {
      return {
        data: await storyDao.getStoryDetail(id),
      };
    }
  },

  /**
   * Create new room with room data
   * @param storyId
   * @param name
   * @param description
   * @returns {*}
   */
  async createRoom({ storyId, name, description }) {
    const { roomDao } = await useDao();
    try {
      const { data } = await http.post("api/room", {
        storyId,
        name,
        description,
      });
      await roomDao.updateRoomList(data);
      return data;
    } catch (e) {
      // ignore
    }
  },

  /**
   * Get room detail by room id
   * @param id
   * @returns {Promise<{data: (Promise<{data: *}|*|{data: *}|undefined>|Promise<{storyId, roomDescription, imageUrl: *, storyTitle, roomCreateTime: (string|*), roomMembers: *, roomId, roomName}>|Promise<{storyId: *, createTime: *, members: *, name: *, description: *, id: *, delete: *}|undefined>|*)}|*>}
   */
  async getRoomDetail(id) {
    const { roomDao } = await useDao();
    // offline directly read from the indexDB
    if (!navigator.onLine) {
      return {
        data: await roomDao.getRoomDetail(id),
      };
    }

    try {
      return http.get("api/room", {
        params: {
          id,
        },
      });
    } catch (e) {
      return {
        data: await roomDao.getRoomDetail(id),
      };
    }
  },

  /**
   * Get real-time room members by room id
   * @param id
   * @returns {*}
   */
  getRoomMembers(id) {
    return http.get("api/room/listMembers", {
      params: {
        id,
      },
    });
  },
};
