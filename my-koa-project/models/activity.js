// 导入 mongoose 模块
const mongoose = require("mongoose");
const { Schema } = mongoose;
let Activity;
if (mongoose.models.Activity) {
    Activity = mongoose.model("Activity");
} else {
  const userSchema = new Schema({
    name: String,
    date: String,
    image: String,
    type: String,
  });
  Activity = mongoose.model("Activity", userSchema);
}

module.exports = Activity;
