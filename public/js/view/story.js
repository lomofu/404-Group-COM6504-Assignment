/**
 * @format
 * @author lomofu
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

    type.value = 0;

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
             <li id="${id}" class="list-group-item d-flex p-3">
                <img src="${image}"
                     width="150"
                     height="150"
                     class="rounded">
                <div class="ms-3 d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between">
                        <h1>${title}</h1>
                        <h3>@${author}</h3>
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
    });

    $('#list-container li').click(function () {
        click(this.id);
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
        $gridContainer.append(`<div class="col-3 mt-4">
                        <div id="${id}" class="card mycard" onclick="loadStoryDetails(this.id)">
                            <img src="${image}" class="card-img-top">
                            <div class="card-body">
                                <div class="card-title d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">${title}</h5>
                                    <div class="d-flex align-items-center">
                                        <i class="bi bi-chat-left-dots"></i>
                                        <span class="ms-2">Rooms</span>
                                        <span class="ms-1">${rooms}</span>
                                    </div>
                                </div>
                                <h6>@${author}</h6>
                                <p class="card-text">${description}</p>
                                <p>${createTime}</p>
                            </div>
                        </div>
                    </div>`);
    });

    $('#list-container li').click(function () {
        click(this.id);
    });

    $gridContainer.removeClass("d-none");
    $gridContainer.hide().fadeIn();
};

const click = (id) => window.location.replace(`/storyDetail?storyId=${id}`);