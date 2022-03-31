/**
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/27
 */

const apiKey = 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';
const roomId = window.location.pathname
    .split("/")
    .filter((e) => e !== "" && e !== "room")[0];

/**
 * displays the Google Graph widget
 */
const widgeInit = () => {
    let config = {
        'limit': 10, 'languages': ['en'], 'maxDescChars': 100, 'selectHandler': selectItem,
    };
    KGSearchWidget(apiKey, document.getElementById("google-kl-input"), config);
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
const selectItem = async (event) => {
    let row = event.row;
    let KLGHistory = await missionIndexDB.getKLGData(roomId);
    let id=0;
    for (let elm of KLGHistory) {
        if(row.name==elm.row.name){
            id = elm.id;
        }
    }
    if(id==0){
        await missionIndexDB.storeKLGData({roomId: roomId, row: row});
        id = KLGHistory.length + 1;
    }

    $('#google-cards').append(`
<div class="card w-100 my-2">
    <div class="card-body">
        <h5 class="card-title">${row.name}</h5>
        <p class="card-text">${row.rc}</p>
        <a href="${row.qc}" class="card-link" target="_blank">Link to WebPage</a>
    </div>
</div>
    `);
    $('#google-kl-input').val("");
}
