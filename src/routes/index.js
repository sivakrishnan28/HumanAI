const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const dashboardController = require("../controllers/dashboardController");
const messagesController = require("../controllers/messagesController");

router.get("/", homeController.home);

router.get("/api/dashboard", dashboardController.dashboard);

router.get("/api/messages", messagesController.getMessages);

module.exports = router;