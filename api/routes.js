const controllers = require("./controllers.js");
const express = require("express");

const router = express.Router();

//router.get("/", controllers.hello);
router.get("/wines", controllers.readDir);
router.post("/wines", controllers.writeFile);

// write your routes

module.exports = router;
