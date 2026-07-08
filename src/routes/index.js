const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const dashboardController = require("../controllers/dashboardController");

router.get("/", homeController.home);

router.get("/api/dashboard", dashboardController.dashboard);

module.exports = router;