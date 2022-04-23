/**
 * this file contains the functions to control the drawing on the canvas
 *
 * @format
 */
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

export const useCanvas = (roomId, username, sct, imageURL) => {
  canvas = $("#main-canvas");
  room = roomId;
  userId = name;
  socket = sct;

  _initImage(imageURL);
  _initEvents();
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
    // const canvas = ctx.canvas;
    // const hRatio = canvas.width / img.width;
    // const vRatio = canvas.height / img.height;
    // const ratio = Math.min(hRatio, vRatio);
    // const centerShift_x = (canvas.width - img.width * ratio) / 2;
    // const centerShift_y = (canvas.height - img.height * ratio) / 2;
    //
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(
    //   img,
    //   0,
    //   0,
    //   img.width,
    //   img.height,
    //   centerShift_x,
    //   centerShift_y,
    //   img.width * ratio,
    //   img.height * ratio,
    // );
  };
  img.src = imageURL;
};

function drawImageScaled(img, canvas, ctx) {
  // get the top left position of the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height);
}

const _initEvents = () => {
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
      }
    }
  });
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
  debugger;
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
};

// export function initCanvas(sckt, imageUrl, roomId, name) {
//   room = roomId;
//   userId = name;
//   socket = sckt;
//   let flag = false,
//       prevX,
//       prevY,
//       currX,
//       currY = 0;
//
//   // event on the canvas when the mouse is on it
//   canvas.on("mousemove mousedown mouseup mouseout", function (e) {
//     prevX = currX;
//     prevY = currY;
//     currX = e.clientX - canvas.position().left;
//     currY = e.clientY - canvas.position().top;
//     if (e.type === "mousedown") {
//       flag = true;
//     }
//     if (e.type === "mouseup" || e.type === "mouseout") {
//       flag = false;
//     }
//     // if the flag is up, the movement of the mouse draws on the canvas
//     if (e.type === "mousemove") {
//       if (flag) {
//         _draw(
//             prevX,
//             prevY,
//             currX,
//             currY,
//             lineOption.color,
//             lineOption.thickness,
//         );
//       }
//     }
//   });
//
//   // this is code left in case you need to  provide a button clearing the canvas (it is suggested that you implement it)
//   $(".canvas-clear").on("click", function (e) {
//     let c_width = canvas.width();
//     let c_height = canvas.height();
//     ctx.clearRect(0, 0, c_width, c_height);
//     // @todo if you clear the canvas, you want to let everyone know via socket.io (socket.emit...)
//   });
//
//   // @todo here you want to capture the event on the socket when someone else is drawing on their canvas (socket.on...)
//   // I suggest that you receive userId, canvasWidth, canvasHeight, x1, y21, x2, y2, color, thickness
//   // and then you call
//   //     let ctx = canvas[0].getContext('2d');
//   //     drawOnCanvas(ctx, canvasWidth, canvasHeight, x1, y21, x2, y2, color, thickness)
//
//   // this is called when the src of the image is loaded
//   // this is an async operation as it may take time
//   // img.addEventListener("load", () => {
//   //   // it takes time before the image size is computed and made available
//   //   // here we wait until the height is set, then we resize the canvas based on the size of the image
//   //   let poll = setInterval(function () {
//   //     if (img.naturalHeight) {
//   //       clearInterval(poll);
//   //       // resize the canvas
//   //       let ratioX = 1;
//   //       let ratioY = 1;
//   //       // if the screen is smaller than the img size we have to reduce the image to fit
//   //       if (img.clientWidth > window.innerWidth)
//   //         ratioX = window.innerWidth / img.clientWidth;
//   //       if (img.clientHeight > window.innerHeight)
//   //         ratioY = img.clientHeight / window.innerHeight;
//   //       let ratio = Math.min(ratioX, ratioY);
//   //       // resize the canvas to fit the screen and the image
//   //       cvx.width = canvas.width = img.clientWidth * ratio;
//   //       cvx.height = canvas.height = img.clientHeight * ratio;
//   //       // draw the image onto the canvas
//   //       drawImageScaled(img, cvx, ctx);
//   //       // hide the image element as it is not needed
//   //       img.style.display = "none";
//   //     }
//   //   }, 10);
//   // });
// }
