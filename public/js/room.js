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

    $("#toast-btn").click(() => {
      console.log(1);
      const toast = new bootstrap.Toast($("#welcomeToast"));
      toast.show();
    });
  };

  const usernameModal = (success) => {
    const myModalEl = document.getElementById("usernameModal");
    const modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
    const username = window.localStorage.getItem(`${roomId}-username`);

    if (!username) {
      modal.show();
    } else {
      success(username);
    }

    $("#username-confirm-btn").click(() => {
      window.localStorage.setItem(
        `${roomId}-username`,
        $("#username-input").val(),
      );
      modal.hide();
      success($("#username-input").val());
    });

    $("#username-close-btn").click(() => {
      window.location.replace("/story");
    });
  };

  const useSocket = (roomId, name) => {
    const socket = io();
    socket.on("connect", () => {
      console.log(roomId, name);
      socket.emit("create or join", roomId, name);
    });

    const $chat = $("#chat-history");

    socket.on("joined", (username) => {
      $chat.append(`
      <div class="joined-info-box">
         <p class="text-center my-0">
           <span class="text-purple">
              ${username}
           </span>
           <span>has joined now!</span>
         </p>
         <p class="text-center text-black-50">
            ${useTimeFormat(new Date())}
         </p>
      </div>`);
    });

    socket.on("left", (username) =>
      $chat.append(`
      <div class="joined-info-box">
         <p class="text-center my-0">
           <span class="text-purple">
              ${username}
           </span>
           <span>has left!</span>
         </p>
         <p class="text-center text-black-50">
            ${useTimeFormat(new Date())}
         </p>
      </div>`),
    );

    socket.on("disconnect", () =>
      socket.emit("leave", roomId, window.localStorage.getItem("username")),
    );

    socket.on("received_chat", (username, message) => {
      $chat.append(`
    <div class="pb-3">
        <div class="text-start">
            <span class="text-purple fw-bold">${username}</span>
            <span class="ps-2 text-black-50">${useTimeFormat(new Date())}</span>
        </div>
        <div class="message p-3 text-start">${message}</div>
    </div>`);
      $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
    });

    $("#send-msg-btn").click(() => {
      const message = $("#chat-input").val();
      const username = window.localStorage.getItem(`${roomId}-username`);
      if (message) {
        $chat.append(`
            <div class="pb-3">
                <div class="text-end">
                    <span class="text-purple fw-bold">${username}</span>
                    <span class="ps-2 text-black-50">
                        ${useTimeFormat(new Date())}
                    </span>
                </div>
                <div class="d-flex justify-content-end w-100">
                    <div class="message sender p-3 text-start">
                        ${message}
                    </div>
                </div>
              </div>
            </div>`);
        $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
        socket.emit("send_chat", roomId, username, message);
      }
    });
  };

  return {
    useRoom,
    useSocket,
    usernameModal,
  };
})();
