"use strict";

const fs = require("fs");
const path = require("path");
const tv4 = require("tv4");
const config = require("../config");

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
  create: async (req, res) => {
    const newWine = req.body;

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

      res.json(newWines);
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
