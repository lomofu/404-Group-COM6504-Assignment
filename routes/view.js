/** @format */

const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { path: "Home" });
});

router.get("/about", function (req, res, next) {
  res.render("about", { path: "About" });
});

router.get("/story", (req, res) => {
  res.render("story", { path: "Story" });
});

router.get("/createStory", (req, res) => {
  res.render("createStory", { path: "createStory" });
});

router.get("/storyDetail", (req, res) => {
  res.render("storyDetail", { path: "StoryDetail" });
});

router.get("/room/:roomId", (req, res) => {
  res.render("room", { roomId: req.params["roomId"] });
});

module.exports = router;
