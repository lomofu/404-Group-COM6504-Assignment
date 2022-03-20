/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/19
 */

const roomModule = (function () {
  const useRoom = () => {
    let flag = false;

    const $screen = $("#room-screen");
    const $google = $("#google-kl");

    $("#google-btn").click(() => {
      flag = !flag;

      if (flag) {
        $screen.addClass("col-8");
        $screen.removeClass("col-12");
        $google.addClass("col-4");
        $google.removeClass("col-0");
        $google.removeClass("d-none");
        $("#google-kl>*").hide().fadeIn("slow");
      } else {
        $("#google-kl>*").fadeOut();
        $screen.removeClass("col-8");
        $screen.addClass("col-12");
        $google.removeClass("col-4");
        $google.addClass("col-0 d-none");
      }
    });
  };

  return {
    useRoom,
  };
})();
