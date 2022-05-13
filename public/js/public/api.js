/**
 * @format
 * @author Jiaqi Fu, Lixuan Lou
 * @desc
 * @create 19/Mar/2022 17:00
 */
import http from "/js/util/http.js";

export const story = {
  getStoryList() {
    return http.get("api/story/list");
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
};
