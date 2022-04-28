/**
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/22
 */

export const load = (dom) => {
    const loadingId = dom + Date.now();
    $(dom).append(`
    <div id='${loadingId}' class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`);
    return $(loadingId);
}