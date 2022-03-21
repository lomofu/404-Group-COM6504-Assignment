/** @format */

const newStoryModule = (function () {
  class Story {
    title;
    author;
    image;
    desc;
  }

  // input overview
  const title = document.getElementById("story-title-input");
  const author = document.getElementById("story-author-input");
  const image = document.getElementById("story-image-input");
  const desc = document.getElementById("story-desc-input");

  const titleOV = document.getElementById("story-title-overview");
  const authorOV = document.getElementById("story-author-overview");
  const descOV = document.getElementById("story-desc-overview");

  title.addEventListener("keyup", (e) => {
    titleOV.textContent = e.target.value;
  });

  author.addEventListener("keyup", (e) => {
    authorOV.textContent = "@" + e.target.value;
  });

  desc.addEventListener("keyup", (e) => {
    descOV.textContent = e.target.value;
  });

  // progress event
  const _progress = () => {
    console.log(111);
    const progressModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("progressModal"),
    );
    console.log(progressModal);
    progressModal.show();
  };

  // submit event
  const form = document.querySelectorAll(".needs-validation")[0];
  form.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (form.checkValidity()) {
        let story = new Story();
        story.title = title.value;
        story.author = author.value;
        story.image = image.value;
        story.desc = desc.value;
        console.log(story);
        _progress();
      }
      form.classList.add("was-validated");
    },
    false,
  );

  // modal creat event
  const useCreateStoryModal = () => {};

  // modal close event
  const resetStoryModel = () => {
    const $title = $("#story-title-input");
    const $author = $("#story-author-input");
    const $image = $("#story-image-input");
    const $desc = $("#story-desc-input");
    const $image_select = $("#story-image-select");

    const $title_ov = $("#story-title-overview");
    const $author_ov = $("#story-author-overview");
    const $image_ov = $("#story-image-overview");
    const $desc_ov = $("#story-desc-overview");

    // reset input value and state
    $title.val("");
    $author.val("");
    $image.val("");
    $desc.val("");
    $image_select.val("1");

    $title.removeClass("is-invalid");
    $author.removeClass("is-invalid");
    $image.removeClass("is-invalid");
    $desc.removeClass("is-invalid");

    // reset overview value
    $title_ov.text("Title");
    $author_ov.text("Author");
    $image_ov.src("/img/image_default.jpg");
    $desc_ov.text("Story Description");

    // reset form state
    const form = document.querySelectorAll(".was-validated")[0];
    if (form) {
      form.classList.remove("was-validated");
      form.classList.add("need-validated");
    }
  };

  return {
    useCreateStoryModal,
    resetStoryModel,
  };
})();
