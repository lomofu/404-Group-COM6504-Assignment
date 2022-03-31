/**
 * @format
 * @Description:
 * @author Lixuan Lou, lomofu, Xu Li
 * @date 2022/3/19
 */
import { useTimeFormat } from "/js/util/util.js";

const roomId = window.location.pathname
    .split("/")
    .filter((e) => e !== "" && e !== "room")[0];

const emojiList = [
  { name: "happy", src: "/img/emoji/happy.webp" },
  {
    name: "happy",
    src: "/img/emoji/kiss.webp",
  },
  { name: "happy", src: "/img/emoji/smile.webp" },
];

const _render = async () => {
  emojiList.forEach(({name, src}) =>
      $("#emoji-box").append(`
        <img width="50" height="50" src="${src}" alt="${name}">
       `),
  );

  const $chat = $("#chat-history");
  let chatHistory = await missionIndexDB.getChatData(roomId);
  for(let elm of chatHistory){
    if(elm.type==0){
      $chat.append(`
       <div class="pb-3 slide-top">
           <div class="text-start">
               <span class="text-purple fw-bold">${elm.username}</span>
               <span class="ps-2 text-black-50">${elm.date}</span>
           </div>
           <div class="message p-3 text-start">${elm.chat}</div>
       </div>`);
      $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
    }

    if(elm.type==1){
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
      $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
    }

    if(elm.type==2){
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
      $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
    }

    if(elm.type==3){
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
      $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
    }

    if(elm.type==4){
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

    if(elm.type==5){
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

};

export const useRoom = () => {
  _render();
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

export const useSocket = (name) => {
  const $chat = $("#chat-history");
  const socket = io();

  socket.on("connect", () => {
    socket.emit("create or join", roomId, name);
  });

  socket.on("joined", (username) => {
    missionIndexDB.storeChatData({roomId:roomId,chat:'',username:username,type:4, date:useTimeFormat(new Date())});
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

  socket.on("left", (username) => {
    missionIndexDB.storeChatData({roomId:roomId,chat:'',username:username,type:5, date:useTimeFormat(new Date())});
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
  });

  socket.on("disconnect", () =>
      socket.emit("leave", roomId, window.localStorage.getItem("username")),
  );

  socket.on("received_chat", (username, message) => {
    missionIndexDB.storeChatData({roomId:roomId,chat:message,username:username,type:0, date:useTimeFormat(new Date())});
    $chat.append(`
     <div class="pb-3 slide-top">
         <div class="text-start">
             <span class="text-purple fw-bold">${username}</span>
             <span class="ps-2 text-black-50">${useTimeFormat(new Date())}</span>
         </div>
         <div class="message p-3 text-start">${message}</div>
     </div>`);
    $chat.animate({ scrollTop: $chat.prop("scrollHeight") }, 500);
  });

  socket.on("received_emoji", (username, message) => {
    missionIndexDB.storeChatData({roomId:roomId,chat:message,username:username,type:1, date:useTimeFormat(new Date())});
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

  // chat send message event
  $("#send-msg-btn").click(() => {
    const message = $("#chat-input").val();
    const username = window.localStorage.getItem(`${roomId}-username`);
    missionIndexDB.storeChatData({roomId:roomId,chat:message,username:username,type:2, date:useTimeFormat(new Date())});
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
      socket.emit("send_chat", roomId, username, message);
    }
  });

  //chat send emoji
  $("#emoji-box img").click(function () {
    const { src } = this;
    const username = window.localStorage.getItem(`${roomId}-username`);
    missionIndexDB.storeChatData({roomId:roomId,chat:src,username:username,type:3, date:useTimeFormat(new Date())});
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
};