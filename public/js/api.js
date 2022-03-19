/**
 * @format
 * @author lomofu
 * @desc
 * @create 19/Mar/2022 17:00
 */

const apis = (function () {
  const ajax = http.instance;
  return {
    storyApis: {
      getStoryList() {
        return ajax.get("api/stories");
      },
      createStory({ title, author, description, image }) {
        return ajax.post("/api/story", {
          title,
          author,
          description,
          image,
        });
      },
    },
  };
})();
