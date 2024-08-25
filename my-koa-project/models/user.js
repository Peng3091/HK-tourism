// 导入 mongoose 模块
const mongoose = require("mongoose");
const { Schema } = mongoose;
let User;
if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  const userSchema = new Schema({
    id: Number,
    username: String,
    password: String,
    type: {
      type: String,
      enum: ["common", "admin", "superAdmin"], // 用户角色可以是 'user' 或 'admin'
      default: "user", // 默认角色是 'user'
    },
    isOnline: Boolean,
  });
  User = mongoose.model("User", userSchema);
}

module.exports = User;
