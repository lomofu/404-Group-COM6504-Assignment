/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/3/27
 */

window.myGoogleKLG = {};

const apiKey = "AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM";
const roomId = window.location.pathname
  .split("/")
  .filter((e) => e !== "" && e !== "room")[0];
let KLGColor;
let username;

/**
 * displays the Google Graph widget
 */
const widgeInit = (c, name) => {
  KLGColor = c;
  username = name;
  let config = {
    limit: 10,
    languages: ["en"],
    maxDescChars: 100,
    selectHandler: selectItem,
  };
  KGSearchWidget(apiKey, document.getElementById("google-kl-input"), config);
};

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
const selectItem = async (event) => {
  let socket = window.mySocket;
  let row = event.row;
  let KLGHistory = await myGoogleKLG.getKLGData(roomId);
  let cardId = 0;
  let exist = false;
  if(KLGHistory){
    for (let elm of KLGHistory) {
      if (row.name === elm.row.name) {
        cardId = elm.id;
        exist = true;
        $("#" + cardId)
            .css("color", "purple")
            .css("border-color", KLGColor);
        $("#google-kl-input").click(() => {
          $("#" + cardId).css("color", "black");
        });
      }
    }
  }
  if (cardId === 0) {
    await myGoogleKLG.storeKLGData({
      roomId: roomId,
      color: KLGColor,
      name: username,
      row: row,
    });
    if(KLGHistory){
      cardId = KLGHistory.length + 1;
    }else {
      cardId = 1;
    }
    $("#google-cards").prepend(`
        <div id="${cardId}" class="card w-100 my-2" style="border-color: ${KLGColor}">
            <div class="card-body">
                <h5 class="card-title">${row.name}</h5>
                <p class="card-text">${row.rc}</p>
                <a href="${row.qc}" class="card-link" target="_blank">Link to WebPage</a>
                <div style="color: ${KLGColor}">Searched by : ${username}</div>
            </div>
        </div>
    `);
    socket.emit("send_KLGraph", roomId, username, KLGColor, row);
  }

  $("#google-kl-input").val("");
};
