/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/22
 */

export const loading = (dom, { height }) => {
    const loadingId = Date.now().toString();
    $(dom).append(`
<div id="${loadingId}" style="position: absolute;left: 0;right: 0;display: flex; justify-content: center;height: 100vh;background-color:white">
    <div class="spinner-border text-secondary" role="status" style="margin-top: ${height}px">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`);
    return $(`#${loadingId}`);
};