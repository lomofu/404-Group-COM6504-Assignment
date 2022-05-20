/**
 * @format
 * @Description:
 */

const express = require("express");
const router = express.Router();
const service = require("../service/roomService");
const storyService = require("../service/storyService");
const { BAD_REQUEST } = require("../util/http");
const { getMembersByRoomId } = require("../socket/index").cache;

// get room list
router.get("/list", async (req, res, next) => {
  const { storyId } = req.query;
  try {
    const list = await service.getRoomList(storyId);
    res.json(list);
  } catch (e) {
    next(e);
  }
});

// create new room
router.post("/", async (req, res, next) => {
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
    const result = await service.save({
      storyId,
      name,
      description,
    });

    res.json(result);
  } catch (e) {
    next(e);
  }
});

// get room details
router.get("/", async (req, res, next) => {
  const { id } = req.query;

  try {
    const room = await service.getRoomDetail(id);

    const { storyId } = room;

    const story = await storyService.getStoryDetail(storyId);

    res.json({
      roomId: id,
      roomName: room.name,
      roomDescription: room.description,
      roomCreateTime: room.createTime,
      roomDelete: room.delete,
      roomMembers: room.members,
      storyId: story._id,
      storyTitle: story.title,
      imageUrl: story.image,
    });
  } catch (e) {
    next(e);
  }
});

// get room members list
router.get("/listMembers", async (req, res, next) => {
  const { id } = req.query;
  try {
    res.json(getMembersByRoomId(id));
  } catch (e) {
    next(e);
  }
});

module.exports = router;