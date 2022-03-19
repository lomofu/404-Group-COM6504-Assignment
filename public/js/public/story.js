const storyModule = (function () {
    class Story {
        title;
        author;
        image;
        desc;
    }

    const useCreateStoryModal = () => {

    }

    const resetStoryModel = () => {
        const $title = $('#story-title-input');
        const $image = $('#story-image-input');
        const $desc = $('#story-desc-input');
        const $author = $('#story-name-input');

        $title.val("");
        $author.val("");
        $image.val("");
        $desc.val("");

        $title.removeClass('is-invalid');
        $image.removeClass('is-invalid');
        $author.removeClass('is-invalid');
        $desc.removeClass('is-invalid');

        $('#story-title-overview').val("");
        $('#story-name-overview').val("");
        $('#story-image-overview').val("");
        $('#story-desc-overview').val("");
    }

    return {
        useCreateStoryModal, resetStoryModel
    }
})();