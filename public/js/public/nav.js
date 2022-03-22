const navModule = (function () {
    // nav router
    const _useRouter = () => {
        const {location: {pathname}} = window;
        router.forEach(e => {
            let active = "";
            if (e.path === pathname) {
                active = "active fredoka-semi";
            }

            $('#nav').append(`
                <li class="nav-item">
                    <a class="nav-link ${active}" href="${e.path}" onclick="return ${active === ''}"
                     style="cursor: ${active === '' ? 'pointer' : 'default'}">${e.name}</a>
                </li>`);
        });
    }

    // create new story modal
    const _useStoryModal = () => {
        const {useCreateStoryModal, resetStoryModel, storyInputCheckModel} = newStoryModule
        const myModalEl = document.getElementById('storyModal');
        myModalEl.addEventListener('show.bs.modal', () => useCreateStoryModal());
        myModalEl.addEventListener('hidden.bs.modal', () => resetStoryModel());

        $('#story-title-input').keydown(() => storyInputCheckModel($('#story-title-input'),$('#story-title-count'),50));
        $('#story-author-input').keydown(() => storyInputCheckModel($('#story-author-input'),$('#story-author-count'),20));
        $('#story-desc-input').keydown(() => storyInputCheckModel($('#story-desc-input'),$('#story-desc-count'),200));
    }

    const useNav = () => {
        _useRouter();
        _useStoryModal();
    }

    return {
        useNav
    }
})();

