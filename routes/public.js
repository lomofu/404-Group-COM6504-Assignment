/**
 * @format
 * @author lomofu
 * @desc
 * @create 11/Mar/2022 15:00
 */

const express = require("express");
const router = express.Router();

router.get("/nav", (req, res) => {
  res.render("public/nav");
});

router.get("/header", (req, res) => {
  res.render("public/header");
});

router.get("/script", (req, res) => {
  res.render("public/script");
});

router.get("/create-story", (req, res) => {
  res.render("public/create-story");
});

module.exports = router;
