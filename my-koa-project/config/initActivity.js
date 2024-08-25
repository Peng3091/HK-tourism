#!/usr/bin/env node
const { ReadFile } = require("../utils/ReadWriteFile.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myDB");
const Activity = require("../models/activity.js");
(async () => {
  try {
    const activities = await ReadFile("activity");
    Activity.insertMany(activities);
  } catch (err) {
    console.error(err);
  }
})();
