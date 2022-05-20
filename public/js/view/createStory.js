/**
 * @format
 * @Description:  Related scripts required to render the createStory page
 */
import { useDao } from "/js/db/dao.js";
import { story } from "/js/public/api.js";

export const eventListener = () => {
  _validSize();
  $("#story-image-select").on("change", function () {
    const selectVal = $("#story-image-select").val();
    if (selectVal === "2") {
      $("#story-image-url-input").removeClass("d-none");
      $("#story-image-file-input").addClass("d-none");
    }
    if (selectVal === "1") {
      $("#story-image-url-input").addClass("d-none");
      $("#story-image-file-input").removeClass("d-none");
    }
  });
  $("#preview-btn").click(async () => {
    const flag = await _validPreview();
    if (flag) {
      $("#create-story-card").addClass("d-none");
      $("#preview-story-card").removeClass("d-none");
      _previewStory();
    }
  });

  $("#back-btn").click(() => {
    $("#create-story-card").removeClass("d-none");
    $("#preview-story-card").addClass("d-none");
  });

  $("#create-btn").click(() => {
    _createStory();
  });
};

const _validSize = () => {
  // valid title size
  $("#story-title-input").keydown(() => {
    $("#story-title-limit").text(
      "(" + $("#story-title-input").val().length + "/40)",
    );
    if ($("#story-title-input").val().length > 40) {
      $("#story-title-input").css("color", "red");
      $("#story-title-limit").css("color", "red");
    } else {
      $("#story-title-input").css("color", "black");
      $("#story-title-limit").css("color", "gray");
    }
  });
  // valid author size
  $("#story-author-input").keydown(() => {
    $("#story-author-limit").text(
      "(" + $("#story-author-input").val().length + "/20)",
    );
    if ($("#story-author-input").val().length > 20) {
      $("#story-author-input").css("color", "red");
      $("#story-author-limit").css("color", "red");
    } else {
      $("#story-author-input").css("color", "black");
      $("#story-author-limit").css("color", "gray");
    }
  });
  // valid description size
  $("#story-desc-input").keydown(() => {
    $("#story-desc-limit").text(
      "(" + $("#story-desc-input").val().length + "/200)",
    );
    if ($("#story-desc-input").val().length > 200) {
      $("#story-desc-input").css("color", "red");
      $("#story-desc-limit").css("color", "red");
    } else {
      $("#story-desc-input").css("color", "black");
      $("#story-desc-limit").css("color", "gray");
    }
  });
};

const _validPreview = async () => {
  let tag = true;
  const title = $("#story-title-input").val();
  const author = $("#story-author-input").val();
  const desc = $("#story-desc-input").val();

  if (title === "") {
    $("#story-title-limit").text("Empty!").css("color", "red");
    tag = false;
  }
  if (title.length > 40) {
    tag = false;
  }

  if (author === "") {
    $("#story-author-limit").text("Empty!").css("color", "red");
    tag = false;
  }
  if (author.length > 20) {
    tag = false;
  }

  if (desc === "") {
    $("#story-desc-limit").text("Empty!").css("color", "red");
    tag = false;
  }
  if (desc.length > 200) {
    tag = false;
  }

  const selectVal = $("#story-image-select").val();
  if (selectVal === "1") {
    const file = document.querySelector("input[type=file]").files[0];
    try {
      const fileBase64 = await _getBase64(file);
      if (_validFileType(fileBase64)) {
        return tag;
      } else {
        $("#story-image-limit").text("Invalid Image File").css("color", "red");
        tag = false;
      }
    } catch (e) {
      console.log(e);
      $("#story-image-limit").text("Invalid Image File").css("color", "red");
      tag = false;
    }
  }
  if (selectVal === "2") {
    try {
      await _checkImage($("#story-image-url-input").val());
      return tag;
    } catch (e) {
      $("#story-image-limit").text("Invalid Link").css("color", "red");
      tag = false;
    }
  }
};

const _previewStory = async () => {
  $("#preview-story-title").text($("#story-title-input").val());
  $("#preview-story-author").text("@" + $("#story-author-input").val());
  $("#preview-story-desc").text($("#story-desc-input").val());
  const img = await _getImage();
  $("#preview-story-img").attr("src", img);
};

const _getImage = async () => {
  const selectVal = $("#story-image-select").val();
  let file64 = "";
  if (selectVal === "1") {
    const file = document.querySelector("input[type=file]").files[0];
    file64 = await _getBase64(file);
  }
  if (selectVal === "2") {
    const data = await fetch($("#story-image-url-input").val());
    const blob = await data.blob();
    file64 = await _getBase64(blob);
  }
  if (file64 !== "") {
    return file64;
  }
};

const _getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const _validFileType = (fileBase64) => {
  return fileBase64.substr(5, 6) === "image/";
};

const _createStory = async () => {
  const { storyDao } = await useDao();
  const { storeAStoryData } = storyDao;
  const title = $("#story-title-input").val();
  const author = $("#story-author-input").val();
  const image = $("#preview-story-img").attr("src");
  const description = $("#story-desc-input").val();
  let result;
  try {
    if (navigator.onLine) {
      const { data } = await story.createStory({
        title,
        author,
        description,
        image,
      });
      result = await storeAStoryData(data);
    } else {
      // if offline store into indexDB with offline flag
      result = await storeAStoryData({
        id: Date.now(),
        title,
        author,
        image,
        description,
        createTime: new Date().toISOString(),
        offline: true,
        rooms: 0,
      });
    }
  } catch (e) {
    console.warn("Catch error, store in the indexDB!");
    result = await storeAStoryData({
      id: Date.now(),
      title,
      author,
      image,
      description,
      createTime: new Date().toISOString(),
      offline: true,
      rooms: 0,
    });
  } finally {
    $("#preview-story-card").addClass("d-none");
    $("#create-success-card").removeClass("d-none");
    $("#go-list-btn").click(() => {
      window.location.href = "/story";
    });
    $("#go-story-btn").click(() => {
        window.location.href = "/storyDetail?storyId=" + result;
    });
  }
};

const _checkImage = (url) => {
  return new Promise((resolve, reject) => {
    const imgObj = new Image();
    imgObj.src = url;
    imgObj.onload = (res) => {
      resolve(res);
    };
    imgObj.onerror = (err) => {
      reject(err);
    };
  });
};
