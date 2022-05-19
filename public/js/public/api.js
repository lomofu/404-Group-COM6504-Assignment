/**
 * @format
 * @desc Here contains all the api for room and story
 */
import http from "/js/util/http.js";
import { useDao } from "/js/db/dao.js";

export const story = {
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
      data: await storyDao.getStoryList(),
    };
  },
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
  getStoryDetail(id) {
    return http.get("api/story", {
      params: {
        id,
      },
    });
  },
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
  getRoomList(storyId) {
    return http.get("api/room/list", {
      params: {
        storyId,
      },
    });
  },
  createRoom({ storyId, name, description }) {
    return http.post("api/room", {
      storyId,
      name,
      description,
    });
  },
  getRoomDetail(id) {
    return http.get("api/room", {
      params: {
        id,
      },
    });
  },
  getRoomMembers(id) {
    return http.get("api/room/listMembers", {
      params: {
        id,
      },
    });
  },
};
