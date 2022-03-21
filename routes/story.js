/** @format */

const express = require("express");
const router = express.Router();
const service = require("../service/storyService");
const { BAD_REQUEST, SERVER_ERROR } = require("../util/http");

router.get("/list", async (req, res) => {
  try {
    const list = await service.getStoryList();
    res.json(list);
  } catch (e) {
    console.log(e);
    res.status(SERVER_ERROR.code).send(SERVER_ERROR.message(e.message));
  }
});

router.post("/", async (req, res) => {
  const { title, author, description, image } = req.body;

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

module.exports = router;
