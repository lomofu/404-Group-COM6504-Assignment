/**
 * @format
 * @Description:
 * @author Lixuan Lou
 * @date 2022/4/23
 */

const express = require("express");
const router = express.Router();
const service = require("../service/roomService");
const { BAD_REQUEST, SERVER_ERROR } = require("../util/http");

// get room list
router.get("/list", async (req, res) => {
  const { storyId } = req.query;
  try {
    const list = await service.getRoomList(storyId);
    res.json(list);
  } catch (e) {
    console.log(e);
    res.status(SERVER_ERROR.code).send(SERVER_ERROR.message(e.message));
  }
});

// create new room
router.post("/", async (req, res) => {
  const { storyId, name, description } = req.body;

  if (!storyId) {
    res
      .status(BAD_REQUEST.code)
      .send(BAD_REQUEST.message('Miss the "story Id" value'));
    return;
  }
  if (!name) {
    res
      .status(BAD_REQUEST.code)
      .send(BAD_REQUEST.message('Miss the "name" value'));
    return;
  }
  try {
    const id = await service.save({
      storyId,
      name,
      description,
    });

    res.json(id);
  } catch (e) {
    res
      .status(SERVER_ERROR.code)
      .send(
        SERVER_ERROR.message("Server error, insert failed! Please try again!"),
      );
  }
});

// get room details
router.get("/", async (req, res, next) => {
  const { id } = req.query;

  try {
    const details = await service.getRoomDetail(id);
    res.json(details);
  } catch (e) {
    next(e);
  }
});

module.exports = router;