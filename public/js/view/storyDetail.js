/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/31
 */

export const initView = (data) => {
  const navHeight = $("#nav-bar").outerHeight();

  $("#empty-container").css("height", `${navHeight + 20}px`);

  $(window).scroll(() => {
    const top = $(window).scrollTop();
    const height = $("#nav-bar").outerHeight();

    if (top > height) {
      $("#nav-bar").addClass("shadow");
    } else {
      $("#nav-bar").removeClass("shadow");
    }
  });

  $("#story-detail-title").text(data.title);
  $("#story-detail-author").text(data.author);
  $("#story-detail-desc").text(data.description);
  $("#story-detail-img").attr("src", data.image);
};
