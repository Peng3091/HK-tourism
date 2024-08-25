// 导入 mongoose 模块
const mongoose = require("mongoose");
const { Schema } = mongoose;
let News;
if (mongoose.models.News) {
    News = mongoose.model("News");
} else {
  const userSchema = new Schema({
    title: String,
    description: String,
    image: String,
    url: String,
  });
  News = mongoose.model("News", userSchema);
}

module.exports = News;
