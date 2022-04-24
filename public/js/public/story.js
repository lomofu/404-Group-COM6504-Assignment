/** @format */

class Story {
  title;
  author;
  image;
  description;
}

let story;

const _bindInputEvent = () => {
  Reflect.ownKeys(story).forEach((key) => {
    $(`#story-${key}-input`).keyup(function () {
      story[key] = $(this).val();
    });
  });
};

const _create = () => {
  story = new Story();
  Reflect.ownKeys(story).forEach((key) => {
    Object.defineProperty(story, key, {
      get() {
        return this._key;
      },
      set(newVal) {
        if (this._key === newVal) return;
        if (key !== "image") {
          $(`#static-${key}`).val(newVal);
        } else {
          $(`#static-${key}`).attr("src", newVal);
        }

        this._key = newVal;
      },
    });
  });
  _bindInputEvent();
};

const _reset = () => {
  const $storyFormCard = $(".story-form-card");

  $storyFormCard.removeClass("flip-vertical-fwd-reverse");
  $storyFormCard.css("display", "flex");
  $(".preview-story-card").hide();

  $("#create-btn").show();
  $("#back-btn").show();
  $(".close-btn").hide();
  $("#go-btn").hide();

  Reflect.ownKeys(story).forEach((key) => {
    $(`#story-${key}-input`).val("");
    if (key !== "image") {
      $(`#static-${key}`).val("");
    } else {
      $(`#static-${key}`).attr("src", "/img/default-img.jpg");
    }
  });

  story = null;
};

const _submitEvent = () => {
  console.log(story);
  const { title, description, image, author } = story;

  if (!title) {
    //todo
    return false;
  }

  if (!description) {
    //todo
    return false;
  }

  if (!image) {
    //todo
    return false;
  }

  if (!author) {
    //todo
    return false;
  }
};

export const useCreateStoryModal = () => {
  const $newStoryModal = $("#new-story-modal");
  const $storyFormCard = $(".story-form-card");

  $newStoryModal.on("show.bs.modal", () => _create());

  $newStoryModal.on("hidden.bs.modal", () => _reset());

  $("#preview-btn").click(() => {
    $(".story-form-card").hide();
    $(".preview-story-card").css("display", "flex");
  });

  $("#back-btn").click(() => {
    $(".preview-story-card").hide();
    $storyFormCard.addClass("flip-vertical-fwd-reverse");
    $storyFormCard.css("display", "flex");
  });

  $("#create-btn").click(function () {
    $(".close-btn").fadeIn();
    $("#go-btn").fadeIn();

    $(this).fadeOut();
    $("#back-btn").fadeOut();
  });
};
