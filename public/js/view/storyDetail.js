/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/31
 */

export const initView = (storyData, roomData) => {
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

    _initStoryDetails(storyData);
    _initRoomList(roomData);
};

const _initStoryDetails = (storyData) => {
    const {data} = storyData;
    $("#story-detail-title").text(data.title);
    $("#story-detail-author").text("@" + data.author);
    $("#story-detail-desc").text(data.description);
    $("#story-detail-img").attr("src", data.image);
}

const _initRoomList = (roomData) => {
    const {data} = roomData;
    data.forEach(({name, description, members}) => {
        const room = `
        <div class="w-100 card mt-3">
            <div class="card-body d-flex flex-row">
                <div class="fs-4 me-auto">${name}</div>
                <button class="btn btn-purple">Join</button>
            </div>
            <div class="card-footer">
                <div class="text-start">Members: ${members}</div>
                <div class="text-start">${description}</div>
            </div>
        </div>
        `;
        $('#room-list-container').prepend(room);
    })
}

export const createRoom = () => {
    const createRoomModal = document.getElementById("create-room-modal");
    createRoomModal.addEventListener("show.bs.modal", () => {
        console.log("!!!!!!");
        $('#room-name-input').remove();
    });
}