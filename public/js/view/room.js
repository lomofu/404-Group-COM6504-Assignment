/** @format
 * @desc  Related scripts required to render the room page.
 **/

import { useTimeFormat } from "/js/util/util.js";
import { useCanvas } from "/js/canvas.js";
import { useDao } from "/js/db/dao.js";
import { room } from "/js/public/api.js";

const url = new URL(window.location.href);
const roomId = url.searchParams.get("roomId");

const emojiList = [
  { name: "happy", src: "/img/emoji/happy.webp" },
  {
    name: "happy",
    src: "/img/emoji/kiss.webp",
  },
  { name: "happy", src: "/img/emoji/smile.webp" },
];
const { chatDao, KLGDao } = await useDao();
const { getChatData, storeChatData } = chatDao;
const { getKLGData } = KLGDao;

/**
 *  Render history data about chat history, emoji list and google knowledge graph history
 * @returns {Promise<void>}
 * @private
 */
const _render = async () => {
  emojiList.forEach(({ name, src }) =>
    $("#emoji-box").append(`
        <img width="50" height="50" src="${src}" alt="${name}">
       `),
  );
  $("#chat-input").val("");
  $("#nav-chat-btn").click(() => {
    $("#nav-chat").removeClass("d-none");
    $("#nav-members").addClass("d-none");
  });

  $("#nav-members-btn").click(() => {
    $("#nav-chat").addClass("d-none");
    $("#nav-members").removeClass("d-none");
  });

  _renderChatHistory();

  _renderKLGraph();
};

/**
 * Render chat history
 * @returns {Promise<void>}
 * @private
 */
async function _renderChatHistory() {
  const $chat = $("#chat-history");
  let chatHistory = await getChatData(roomId);
  for (let elm of chatHistory) {
    if (elm.type === 0) {
      $chat.append(`
       <div class="pb-3 slide-top">
           <div class="text-start">
               <span class="text-purple fw-bold">${elm.username}</span>
               <span class="ps-2 text-black-50">${elm.date}</span>
           </div>
           <div class="message p-3 text-start">${elm.chat}</div>
       </div>`);
    }
    if (elm.type === 1) {
      $chat.append(`
         <div class="pb-3 slide-top">
             <div class="text-start">
                 <span class="text-purple fw-bold">${elm.username}</span>
                 <span class="ps-2 text-black-50">
                     ${elm.date}
                 </span>
             </div>
             <img width="60" height="60" src="${elm.chat}" />
         </div>`);
    }
    if (elm.type === 2) {
      $chat.append(`
         <div class="pb-3 slide-top">
             <div class="text-end">
                 <span class="text-purple fw-bold">${elm.username}</span>
                 <span class="ps-2 text-black-50">
                     ${elm.date}
                 </span>
             </div>
             <div class="d-flex justify-content-end w-100">
                 <div class="message sender p-3 text-start">
                     ${elm.chat}
                 </div>
             </div>
           </div>
         </div>`);
    }
    if (elm.type === 3) {
      $chat.append(`
         <div class="pb-3">
             <div class="text-end">
                 <span class="text-purple fw-bold">${elm.username}</span>
                 <span class="ps-2 text-black-50">
                     ${elm.date}
                 </span>
             </div>
             <div class="d-flex justify-content-end w-100">
                 <img height="60" width="60" src="${elm.chat}">
             </div>
           </div>
         </div>`);
    }
    if (elm.type === 4) {
      $chat.append(`
         <div class="joined-info-box">
            <p class="text-center my-0">
              <span class="text-purple">
                 ${elm.username}
              </span>
              <span>has joined now!</span>
            </p>
            <p class="text-center text-black-50">
               ${elm.date}
            </p>
         </div>`);
    }
    if (elm.type === 5) {
      $chat.append(`
         <div class="joined-info-box">
            <p class="text-center my-0">
              <span class="text-purple">
                 ${elm.username}
              </span>
              <span>has left!</span>
            </p>
            <p class="text-center text-black-50">
               ${elm.date}
            </p>
         </div>`);
    }
  }

  $chat.animate({ scrollTop: $chat.prop("scrollHeight") });
}

/**
 *  Render google knowledge graph history
 * @returns {Promise<void>}
 * @private
 */
async function _renderKLGraph() {
  let KLGHistory = await getKLGData(roomId);
  for (let elm of KLGHistory) {
    $("#google-cards").prepend(`
      <div id="${elm.id}" class="card w-100 my-2" style="border-color: ${elm.color}">
          <div class="card-body">
              <h5 class="card-title">${elm.row.name}</h5>
              <p class="card-text">${elm.row.rc}</p>
              <a href="${elm.row.qc}" class="card-link" target="_blank">Link to WebPage</a>
              <div style="color: ${elm.color}">Searched by : ${elm.name}</div>
          </div>
      </div>
    `);
    $("#google-kl-input").val("");
  }
}

/**
 * Render room details at left off-canvas
 * @param data
 * @private
 */
const _renderRoomDetail = (data) => {
  const { roomName, roomDescription, roomCreateTime, storyTitle } = data;
  $("#room-detail-title").text(roomName);
  $("#room-detail-time").text(roomCreateTime);
  $("#story-detail-title").text(storyTitle);
  if (roomDescription === "") {
    $("#room-detail-desc")
      .text("(Null)")
      .css("color", "gray")
      .css("font-size", "1rem");
  } else {
    $("#room-detail-desc")
      .text(roomDescription)
      .css("color", "black")
      .css("font-size", "1.25rem");
  }
  $("#leave-title").text("Room Name: " + roomName);
};

/**
 * Render real-time room members at the right section
 * @returns {Promise<void>}
 * @private
 */
const _renderMemberList = async () => {
  const { data } = await room.getRoomMembers(roomId);
  $("#room-members").empty();
  data.forEach((d) => {
    $("#room-members").prepend(
      `<p class="fs-5"><i class="bi bi-person-fill text-primary px-2"></i>${d.name}</p>`,
    );
  });
};

/**
 * Render data and listening to the open state of the Google Knowledge Graph section
 * @returns {Promise<void>}
 */
export const useRoom = async () => {
  await _render();
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

/**
 * Render username input modal if the user is entering the room for the first time
 * @param success
 */
export const usernameModal = (success) => {
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

function chatEvents($chat, socket) {
  // chat send message event
  $("#send-msg-btn").click(() => {
    const message = $("#chat-input").val();
    const username = window.localStorage.getItem(`${roomId}-username`);
    storeChatData({
      roomId: roomId,
      chat: message,
      username: username,
      type: 2,
      date: useTimeFormat(new Date()),
    });
    if (message) {
      $chat.append(`
             <div class="pb-3 slide-top">
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
      $("#chat-input").val("");
      $("#chat-input").attr("rows", 1);
      socket.emit("send_chat", roomId, username, message);
    }
  });

  //chat send emoji
  $("#emoji-box img").click(function () {
    const { src } = this;
    const username = window.localStorage.getItem(`${roomId}-username`);
    storeChatData({
      roomId: roomId,
      chat: src,
      username: username,
      type: 3,
      date: useTimeFormat(new Date()),
    });
    $chat.append(`
             <div class="pb-3">
                 <div class="text-end">
                     <span class="text-purple fw-bold">${username}</span>
                     <span class="ps-2 text-black-50">
                         ${useTimeFormat(new Date())}
                     </span>
                 </div>
                 <div class="d-flex justify-content-end w-100">
                     <img height="60" width="60" src="${src}">
                 </div>
               </div>
             </div>`);
    $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
    socket.emit("send_emoji", roomId, username, src);
  });
}

/**
 * Use Socket.io for user communication
 * @param name
 * @returns {Promise<void>}
 */
export const useSocket = async (name) => {
  const $chat = $("#chat-history");
  const socket = io();

  chatEvents($chat, socket);

  if (!navigator.onLine) {
    const { data } = await room.getRoomDetail(roomId);
    await useCanvas(roomId, name, socket, data.imageUrl);
    _renderRoomDetail(data);
    return;
  }

  socket.on("connect", async () => {
    socket.emit("create or join", roomId, name);
    const { data } = await room.getRoomDetail(roomId);
    await useCanvas(roomId, name, socket, data.imageUrl);
    _renderRoomDetail(data);
  });

  socket.on("joined", (username) => {
    storeChatData({
      roomId: roomId,
      chat: "",
      username: username,
      type: 4,
      date: useTimeFormat(new Date()),
    });
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

    _renderMemberList();
  });

  socket.on("left", async (username) => {
    storeChatData({
      roomId: roomId,
      chat: "",
      username: username,
      type: 5,
      date: useTimeFormat(new Date()),
    });
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
       </div>`);
    _renderMemberList();
  });

  socket.on("received_chat", (username, message) => {
    storeChatData({
      roomId: roomId,
      chat: message,
      username: username,
      type: 0,
      date: useTimeFormat(new Date()),
    });
    $chat.append(`
     <div class="pb-3 slide-top">
         <div class="text-start">
             <span class="text-purple fw-bold">${username}</span>
             <span class="ps-2 text-black-50">${useTimeFormat(
               new Date(),
             )}</span>
         </div>
         <div class="message p-3 text-start">${message}</div>
     </div>`);
    $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
  });

  socket.on("received_emoji", (username, message) => {
    storeChatData({
      roomId: roomId,
      chat: message,
      username: username,
      type: 1,
      date: useTimeFormat(new Date()),
    });
    $chat.append(`
     <div class="pb-3 slide-top">
         <div class="text-start">
             <span class="text-purple fw-bold">${username}</span>
             <span class="ps-2 text-black-50">
                 ${useTimeFormat(new Date())}
             </span>
         </div>
         <img width="60" height="60" src="${message}" />
     </div>`);
    $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
  });

  socket.on("received_KLGraph", async (color, username, row) => {
    await myGoogleKLG.storeKLGData({
      roomId: roomId,
      color: color,
      name: username,
      row: row,
    });
    let KLGHistory = await myGoogleKLG.getKLGData(roomId);
    let cardId = KLGHistory.length;
    $("#google-cards").prepend(`
      <div id="${cardId}" class="card w-100 my-2" style="border-color: ${color}">
          <div class="card-body">
              <h5 class="card-title">${row.name}</h5>
              <p class="card-text">${row.rc}</p>
              <a href="${row.qc}" class="card-link" target="_blank">Link to WebPage</a>
              <div style="color: ${color}">Searched by : ${username}</div>
          </div>
      </div>
    `);
    $("#google-kl-input").val("");
  });

  window.mySocket = socket;
};

/**
 * Render hover paint button and clean button
 */
export const useToolBox = () => {
  const $tool = $("#tool-box");
  $tool.mousedown(dg);

  function dg(e) {
    window.my_dragging = {};
    my_dragging.pageX0 = e.pageX;
    my_dragging.pageY0 = e.pageY;
    my_dragging.elem = this;
    my_dragging.offset0 = $(this).offset();

    function handle_dragging(e) {
      var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
      var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
      $(my_dragging.elem).offset({ top: top, left: left });
    }

    function handle_mouseup(e) {
      $("body")
        .off("mousemove", handle_dragging)
        .off("mouseup", handle_mouseup);
    }

    $("body").on("mouseup", handle_mouseup).on("mousemove", handle_dragging);
  }
};
