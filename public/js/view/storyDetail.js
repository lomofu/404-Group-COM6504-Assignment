/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/31
 */

import {story, room} from "/js/public/api.js";

const storyId = new URLSearchParams(window.location.search).get('storyId');

export const initView = () => {
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
    _initRoomList();
    _addListener();
};

const _initStoryDetails = async () => {
    const {data} = await story.getStoryDetail(storyId);
    $("#story-detail-title").text(data.title);
    $("#story-detail-author").text("@" + data.author);
    $("#story-detail-desc").text(data.description);
    $("#story-detail-img").attr("src", data.image);
}

const _initRoomList = async () => {
    $('#room-list-container').empty();
    const {data} = await room.getRoomList(storyId);
    data.forEach(({id, name, description, members}) => {
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

        $('#room-list-container').prepend(room);
    })
}

const _addListener = () => {

    const createRoomModal = document.getElementById("create-room-modal");
    createRoomModal.addEventListener('show.bs.modal', () => {
        $('#room-name-input').val("").css('color', 'black');
        $('#room-desc-input').val("").css('color', 'black');
        $('#room-name-limit').text("");
        $('#room-desc-limit').text("");
    });
    createRoomModal.addEventListener('hide.bs.modal', () => {
        _initRoomList();
    });

    $('#room-name-input').keydown(() => {
        $('#room-name-limit').text("(" + $('#room-name-input').val().length + "/30)");
        if ($('#room-name-input').val().length > 30) {
            $('#room-name-input').css('color', 'red');
            $('#room-name-limit').css('color', 'red');
        } else {
            $('#room-name-input').css('color', 'black');
            $('#room-name-limit').css('color', 'gray');
        }
    });

    $('#room-desc-input').keydown(() => {
        $('#room-desc-limit').text("(" + $('#room-desc-input').val().length + "/100)");
        if ($('#room-desc-input').val().length > 100) {
            $('#room-desc-input').css('color', 'red');
            $('#room-desc-limit').css('color', 'red');
        } else {
            $('#room-desc-input').css('color', 'black');
            $('#room-desc-limit').css('color', 'gray');
        }
    });

    $('#create-btn').click(async () => {
        if ($('#room-name-input').val().length === 0) {
            $('#room-name-limit').text("Empty!").css('color', 'red');
        } else if ($('#room-name-input').val().length < 30 && $('#room-desc-input').val().length < 100) {
            const name = $('#room-name-input').val();
            let desc = $('#room-desc-input').val();
            const {data} = await room.createRoom({storyId, name, desc});
            bootstrap.Modal.getInstance(createRoomModal).hide();
            window.open('/room/' + data);
        }
    });

}

export const joinRoom = (roomId) => {
    window.open('/room/' + roomId);
}