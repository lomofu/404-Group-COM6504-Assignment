/**
 * @format
 * @author lomofu, Lixuan Lou
 * @desc
 * @create 18/Mar/2022 12:50
 */
export const useChangeType = (data) => {
    if (!data) {
        data = [];
    }

    const type = {
        value: -1,
    };

    Object.defineProperty(type, "value", {
        get() {
            return this._value;
        }, set(val) {
            if (this._value === val) return;
            if (this._value !== 0 && val === 0) _useList(data);
            if (this._value !== 1 && val === 1) _useGrid(data);
            this._value = val;
        },
    });

    type.value = 1;

    return type;
};

const _useList = (list) => {
    if (!list || (list.length && list.length <= 0)) {
        return;
    }
    const $listContainer = $("#list-container");
    const $gridContainer = $("#grid-container");

    $gridContainer.fadeOut();
    $gridContainer.addClass("d-none");
    $listContainer.empty();

    list.forEach(({id, title, image, author, description, createTime, rooms}) => {
        $listContainer.append(`
             <li id="${id}" class="list-group-item d-flex p-3 mb-3 shadow-sm">
                <img src="${image}"
                     width="400"
                     height="200"
                     class="rounded">
                <div class="ms-3 d-flex flex-column justify-content-between w-100">
                    <div class="d-flex justify-content-between">
                        <h3>${title}</h3>
                        <h5>@${author}</h5>
                    </div>
                    <p class="mb-0">${description}</p>
                    <div class="mt-2 d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-chat-left-dots"></i>
                            <span class="ms-2">Rooms</span>
                            <span class="ms-1">${rooms}</span>
                        </div>
                        <span>${createTime}</span>
                    </div>
                </div>
            </li>`);
    },);

    $("#list-container li").click(function () {
        window.location.href = `/storyDetail/` + this.id;
    });

    $listContainer.removeClass("d-none");
    $listContainer.hide().fadeIn();
};

const _useGrid = (list) => {
    if (!list || (list.length && list.length <= 0)) {
        return;
    }

    const $listContainer = $("#list-container");
    const $gridContainer = $("#grid-container");

    $listContainer.fadeOut();
    $listContainer.addClass("d-none");
    $gridContainer.empty();

    list.forEach(({id, title, image, author, description, createTime, rooms}) => {
        $gridContainer.append(`<div class="col-xl-3 col-lg-4 col-md-5 mt-4">
                        <div id="${id}" class="card mycard border-0 shadow-sm">
                            <img src="${image}" class="card-img-top" height="200">
                            <div class="card-body">
                                <div class="card-title">
                                    <h5 class="grid-title mb-0">${title}</h5>
                                </div>
                                <h6>@${author}</h6>
                                <p class="grid-desc card-text">${description}</p>
                            </div>
                            <div class="card-footer bg-transparent border-0 pb-3 d-flex justify-content-between align-items-center">
                                <div>${createTime}</div>
                                <div class="d-flex align-items-center">
                                        <i class="bi bi-chat-left-dots"></i>
                                        <span class="ms-2">Rooms</span>
                                        <span class="ms-1">${rooms}</span>
                                </div>
                            </div>
                        </div>
                    </div>`);
    },);

    $("#grid-container .card").click(function () {
        window.location.href = `/storyDetail/` + this.id;
    });

    $gridContainer.removeClass("d-none");
    $gridContainer.hide().fadeIn();
};
