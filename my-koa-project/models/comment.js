// 导入 mongoose 模块
const mongoose = require("mongoose");
const { Schema } = mongoose;
let Comment;
if (mongoose.models.Comment) {
  Comment = mongoose.model("Comment");
} else {
  const userSchema = new Schema({
    username: String,
    name: String,
    contact: String,
    count: Number,
    address: String,
    dateTimeRange: String,
    feedback_type: [],
    feedback: String,
    remark: String,
  });
  Comment = mongoose.model("Comment", userSchema);
}

module.exports = Comment;
