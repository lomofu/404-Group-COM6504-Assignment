/** @format */

const express = require("express");
const router = express.Router();
const service = require("../service/storyService");
const { BAD_REQUEST } = require("../util/http");

/**
 * get story list once directly
 *
 * @return return all the data from MongoDB
 *
 * @exception when occur, return an empty list
 */
router.get("/list", async (req, res) => {
  try {
    const list = await service.getStoryList();
    res.json(list);
  } catch (e) {
    res.json([]);
  }
});

router.post("/offlineList", async (req, res, next) => {
  try {
    const offlineList = req.body;
    await service.uploadOfflineList(offlineList);
    res.json("update successfully");
  } catch (e) {
    next(e);
  }
});

// create new story
router.post("/", async (req, res, next) => {
  const { title, author, description, image, createTime } = req.body;

  if (!title) {
    res
      .status(BAD_REQUEST.code)
      .send(BAD_REQUEST.message('Miss the "title" value'));
    return;
  }
  if (!author) {
    res
      .status(BAD_REQUEST.code)
      .send(BAD_REQUEST.message('Miss the "author" value'));
    return;
  }
  if (!description) {
    res
      .status(BAD_REQUEST.code)
      .send(BAD_REQUEST.message('Miss the "description" value'));
    return;
  }
  if (!image) {
    res
      .status(BAD_REQUEST.code)
      .send(BAD_REQUEST.message('Miss the "image" value'));
    return;
  }

  try {
    const id = await service.save({
      title,
      author,
      description,
      image,
      createTime,
    });

    res.json(id);
  } catch (e) {
    next(e);
  }
});

// get story details
router.get("/", async (req, res, next) => {
  const { id } = req.query;

  try {
    const details = await service.getStoryDetail(id);
    res.json(details);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
