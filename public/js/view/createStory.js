/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/24
 */
import { story } from "/js/public/api.js";

export const eventListener = () => {
  _validSize();
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

  if ($("#story-title-input").val() === "") {
    $("#story-title-limit").text("Empty!").css("color", "red");
    tag = false;
  }
  if ($("#story-title-input").val().length > 40) {
    tag = false;
  }

  if ($("#story-author-input").val() === "") {
    $("#story-author-limit").text("Empty!").css("color", "red");
    tag = false;
  }
  if ($("#story-author-input").val().length > 20) {
    tag = false;
  }

  if ($("#story-desc-input").val() === "") {
    $("#story-desc-limit").text("Empty!").css("color", "red");
    tag = false;
  }
  if ($("#story-desc-input").val().length > 200) {
    tag = false;
  }

  try {
    await _checkImage($("#story-image-input").val());
    return tag;
  } catch (e) {
    $("#story-image-limit").text("Invalid Link").css("color", "red");
    tag = false;
  }
};

const _previewStory = () => {
  $("#preview-story-title").text($("#story-title-input").val());
  $("#preview-story-author").text("@" + $("#story-author-input").val());
  $("#preview-story-desc").text($("#story-desc-input").val());
  $("#preview-story-img").attr("src", $("#story-image-input").val());
};

const _createStory = async () => {
  const title = $("#story-title-input").val();
  const author = $("#story-author-input").val();
  const image = $("#story-image-input").val();
  const description = $("#story-desc-input").val();
  const { data } = await story.createStory({
    title,
    author,
    description,
    image,
  });
  if (data) {
    $("#preview-story-card").addClass("d-none");
    $("#create-success-card").removeClass("d-none");
    $("#go-list-btn").click(() => {
      window.location.href = "/story";
    });
    $("#go-story-btn").click(() => {
      window.location.href = "/storyDetail?storyId=" + data;
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
