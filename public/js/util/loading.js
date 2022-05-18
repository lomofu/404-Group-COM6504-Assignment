/**
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/22
 */

export const loading = (dom) => {
    const loadingId = Date.now().toString();
    $(dom).append(`
<div id="${loadingId}" style="position: absolute;left: 0;right: 0;display: flex; justify-content: center;align-items: center;height: 100vh;background-color:white">
    <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`);
    return $(`#${loadingId}`);
};