"use strict";

const fs = require("fs");
const path = require("path");
const tv4 = require("tv4");
const config = require("../config");

const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);

const WINE_SCHEMA = path.join(
  __dirname,
  "/..",
  config.DATA_DIR,
  "/wine-schema.json"
);
const DATA_PATH = path.join(
  __dirname,
  "/..",
  config.DATA_DIR,
  "/wine-data.json"
);

const controllers = {
  readDir: async (req, res, next) => {
    try {
      const list = await readdir(DATA_PATH);
      console.log(DATA_PATH);
      res.json(list);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log(DATA_PATH);
        res.status(404).end();
      }
      console.error(err);
      next(err);
    }
  },

  readFile: async (req, res, next) => {
    const wineName = req.params.name;
    try {
      const wineText = await readFile(`${DATA_PATH}/${wineName}`, "utf-8");
      const responseData = {
        name: wineName,
        text: wineText,
      };
      res.json(responseData);
    } catch (err) {
      if (err.code === "ENOENT") res.status(404).end();
      console.error(err);
      next(err);
    }
  },
  writeFile: async (req, res, next) => {
    const newWine = req.body;
    console.log(newWine);
    try {
      const winesDataString = await readFile(DATA_PATH, "utf-8");
      const winesData = JSON.parse(winesDataString);

      newWine.id = winesData.nextId;
      winesData.nextId++;

      const isValid = tv4.validate(newWine, WINE_SCHEMA);

      if (!isValid) {
        const error = tv4.error;
        console.error(error);

        res.status(400).json({
          error: {
            message: error.message,
            dataPath: error.dataPath,
          },
        });
        return;
      }

      winesData.wines.push(newWine);

      const newWinesDataString = JSON.stringify(winesData, null, "  ");

      await writeFile(DATA_PATH, newWinesDataString);

      res.json(newWine);
    } catch (err) {
      console.log(err);

      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }

      next(err);
    }
  },
};

module.exports = controllers;
