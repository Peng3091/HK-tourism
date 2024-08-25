#!/usr/bin/env node
const { ReadFile } = require("../utils/ReadWriteFile.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myDB");
const User = require("../models/user.js");
let usersType = ["common", "admin", "superAdmin"];
(async () => {
  for (let type of usersType) {
    try {
      const userData = await ReadFile(type); // 假设数据文件在 './data' 目录下，并且文件名是 'type.json'
      for (const item of userData) {
        await User.create(item);
        console.log(`Successfully created ${type} user:`, item);
      }
    } catch (err) {
      console.error(`Error processing type ${type}:`, err);
    }
  }
})();
