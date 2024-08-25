#!/usr/bin/env node
const { ReadFile } = require("../utils/ReadWriteFile.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myDB");
const News = require("../models/news.js");
(async () => {
  try {
    const news = await ReadFile("news");
    News.insertMany(news);
  } catch (err) {
    console.error(err);
  }
})();
