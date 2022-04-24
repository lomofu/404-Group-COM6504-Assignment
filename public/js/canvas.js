/**
 * this file contains the functions to control the drawing on the canvas
 *
 * @format
 */
import { useDao } from "/js/db/dao.js";
const { annotationDao } = await useDao();
const { storeAnnotationData, getAnnotationData } = annotationDao;

const lineOption = {
  color: "red",
  thickness: 4,
};

const cvx = document.getElementById("main-canvas");
const ctx = cvx.getContext("2d");
let canvas;

let room;
let userId;
let socket;

export const useCanvas = async (roomId, username, sct, imageURL) => {
  canvas = $("#main-canvas");
  room = roomId;
  userId = username;
  socket = sct;
  _initImage(imageURL);
  _initEvents(room, userId, socket, imageURL);
};

const _initImage = (imageURL) => {
  const img = new Image();

  img.onload = () => {
    let ratioX = 1;
    let ratioY = 1;
    // if the screen is smaller than the img size we have to reduce the image to fit
    if (img.width > window.innerWidth) ratioX = window.innerWidth / img.width;
    if (img.height > window.innerHeight)
      ratioY = img.height / window.innerHeight;
    let ratio = Math.min(ratioX, ratioY);
    // resize the canvas to fit the screen and the image
    cvx.width = canvas.width = img.width * ratio;
    cvx.height = canvas.height = img.height * ratio;
    drawImageScaled(img, cvx, ctx);
  };
  img.src = imageURL;
};

function drawImageScaled(img, canvas, ctx) {
  // get the top left position of the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height);
}

const _initEvents = (room, userId, socket, imageURL) => {
  let flag = false;
  let prevX = 0;
  let prevY = 0;
  let currX = 0;
  let currY = 0;

  // event on the canvas when the mouse is on it
  canvas.on("mousemove mousedown mouseup mouseout", function (e) {
    prevX = currX;
    prevY = currY;

    const { x, y } = getMousePos(cvx, e);

    currX = x;
    currY = y;

    if (e.type === "mousedown") {
      flag = true;
    }
    if (e.type === "mouseup" || e.type === "mouseout") {
      flag = false;
    }
    // if the flag is up, the movement of the mouse draws on the canvas
    if (e.type === "mousemove") {
      if (flag) {
        _draw(
          ctx,
          canvas.width,
          canvas.height,
          prevX,
          prevY,
          currX,
          currY,
          lineOption.color,
          lineOption.thickness,
        );
        socket.emit(
          "draw",
          room,
          userId,
          canvas.width,
          canvas.height,
          prevX,
          prevY,
          currX,
          currY,
          lineOption.color,
          lineOption.thickness,
        );

        storeAnnotationData({
          roomId: room,
          url: imageURL,
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          prevX: prevX,
          prevY: prevY,
          currX: currX,
          currY: currY,
          color: lineOption.color,
          thickness: lineOption.thickness,
        });
      }
    }
  });

  socket.on(
    "draw",
    function (
      room,
      userId,
      width,
      height,
      prev_X,
      prev_Y,
      curr_X,
      curr_Y,
      color_,
      thickness_,
    ) {
      let ctx = canvas[0].getContext("2d");
      _draw(
        ctx,
        width,
        height,
        prev_X,
        prev_Y,
        curr_X,
        curr_Y,
        color_,
        thickness_,
      );
    },
  );
};

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX / (rect.right - rect.left)) * canvas.width,
    y: (evt.clientY / (rect.bottom - rect.top)) * canvas.height,
  };
}

const _draw = (
  ctx,
  canvasWidth,
  canvasHeight,
  prevX,
  prevY,
  currX,
  currY,
  color,
  thickness,
) => {
  debugger
  //get the ration between the current canvas and the one it has been used to draw on the other comuter
  let ratioX = canvas.width / canvasWidth;
  let ratioY = canvas.height / canvasHeight;
  // update the value of the points to draw
  prevX *= ratioX;
  prevY *= ratioY;
  currX *= ratioX;
  currY *= ratioY;
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.stroke();
  ctx.beginPath();
};

export const draw = (prevX, prevY, currX, currY, color, thickness) => {
  _draw(
    ctx,
    canvas.width,
    canvas.height,
    prevX,
    prevY,
    currX,
    currY,
    color,
    thickness,
  );
};
