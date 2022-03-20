/** @format */

const express = require("express");
const router = express.Router();
const service = require("../service/storyService");

router.post("/", async (req, res) => {
  const { title, author, description, image } = req.body;
  if (!title) {
    res.status(400).send('Miss the "title" value');
  }
  if (!author) {
    res.status(400).send('Miss the "author" value');
  }
  if (!description) {
    res.status(400).send('Miss the "description" value');
  }
  if (!image) {
    res.status(400).send('Miss the "image" value');
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
    res.status(500).json("Server error, insert failed! Please try again!");
  }
});

module.exports = router;
