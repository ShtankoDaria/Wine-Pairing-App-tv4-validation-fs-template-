const controllers = require("./controllers.js");
const express = require("express");

const router = express.Router();

//router.get("/", controllers.hello);
router.post("/wines", controllers.create);

// write your routes

module.exports = router;
