const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const dashboardController = require("../controllers/dashboardController");
const messagesController = require("../controllers/messagesController");
const repliesController = require("../controllers/repliesController");

router.get("/", homeController.home);

router.get("/api/dashboard", dashboardController.dashboard);

router.get("/api/messages", messagesController.getMessages);

router.get("/api/replies", repliesController.getReplies);

module.exports = router;