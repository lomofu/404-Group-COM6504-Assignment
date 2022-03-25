/**
 * @format
 * @author lomofu
 * @desc
 * @create 19/Mar/2022 17:00
 */
import http from "/js/util/http.js";

export const story = {
  getStoryList() {
    return http.get("api/stories");
  },
  createStory({ title, author, description, image }) {
    return http.post("api/story", {
      title,
      author,
      description,
      image,
    });
  },
};
