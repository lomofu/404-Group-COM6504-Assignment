/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/31
 */

import { story, room } from "/js/public/api.js";

let storyId;

export const initView = (id) => {
  storyId = id;
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

  _initStoryDetails();
  _addListener();
};

const _initStoryDetails = async () => {
  try {
    const { data } = await story.getStoryDetail(storyId);
    $("#story-detail-title").text(data.title);
    $("#story-detail-author").text("@" + data.author);
    $("#story-detail-desc").text(data.description);
    $("#story-detail-img").attr("src", data.image);
    $("#rooms-number").text(data.rooms);
    if (data.rooms > 0) {
      _initRoomList();
    }
  } catch (e) {}
};

const _initRoomList = async () => {
  $("#room-list-container").empty();
  const { data } = await room.getRoomList(storyId);
  data.forEach(({ id, name, description, members }) => {
    let room;
    if (description === undefined) {
      room = `
        <div class="w-100 card mt-3">
            <div class="card-body d-flex flex-row">
                <div class="fs-4 me-auto">${name}</div>
                <button id="${id}" onclick="{window.open('/room/'+this.id)}" class="btn btn-purple join-btn">Join</button>
            </div>
            <div class="card-footer">
                <div class="text-start">Members: ${members}</div>
            </div>
        </div>
        `;
    } else {
      room = `
        <div class="w-100 card mt-3">
            <div class="card-body d-flex flex-row">
                <div class="fs-4 me-auto">${name}</div>
                <button  id="${id}" onclick="{window.open('/room/'+this.id)}" class="btn btn-purple join-btn">Join</button>
            </div>
            <div class="card-footer">
                <div class="text-start">Members: ${members}</div>
                <div class="text-start">${description}</div>
            </div>
        </div>
        `;
    }

    $("#room-list-container").prepend(room);
  });
};

const _addListener = () => {
  const createRoomModal = document.getElementById("create-room-modal");
  createRoomModal.addEventListener("show.bs.modal", () => {
    $("#create-room-name-input").val("").css("color", "black");
    $("#create-room-desc-input").val("").css("color", "black");
    $("#room-name-limit").text("");
    $("#room-desc-limit").text("");
  });
  createRoomModal.addEventListener("hide.bs.modal", () => {
    _initRoomList();
  });

  $("#create-room-name-input").keydown(() => {
    $("#room-name-limit").text(
      "(" + $("#create-room-name-input").val().length + "/30)",
    );
    if ($("#create-room-name-input").val().length > 30) {
      $("#create-room-name-input").css("color", "red");
      $("#room-name-limit").css("color", "red");
    } else {
      $("#create-room-name-input").css("color", "black");
      $("#room-name-limit").css("color", "gray");
    }
  });

  $("#create-room-desc-input").keydown(() => {
    $("#room-desc-limit").text(
      "(" + $("#create-room-desc-input").val().length + "/100)",
    );
    if ($("#create-room-desc-input").val().length > 100) {
      $("#create-room-desc-input").css("color", "red");
      $("#room-desc-limit").css("color", "red");
    } else {
      $("#create-room-desc-input").css("color", "black");
      $("#room-desc-limit").css("color", "gray");
    }
  });

  $("#create-room-btn").click(async () => {
    if ($("#create-room-name-input").val().length === 0) {
      $("#room-name-limit").text("Empty!").css("color", "red");
    } else if (
      $("#create-room-name-input").val().length < 30 &&
      $("#create-room-desc-input").val().length < 100
    ) {
      const name = $("#create-room-name-input").val();
      const description = $("#create-room-desc-input").val();
      const { data } = await room.createRoom({ storyId, name, description });
      bootstrap.Modal.getInstance(createRoomModal).hide();
      window.open("/room/" + data);
    }
  });
};
