// 导入 mongoose 模块
const mongoose = require("mongoose");
const { Schema } = mongoose;
let Query;
if (mongoose.models.Query) {
  Query = mongoose.model("Query");
} else {
  const userSchema = new Schema({
    username: String,
    name: String,
    contact: String,
    count: Number,
    address: String,
    dateTime: String,
    type: [],
    content: String,
    remark: String,
  });
  Query = mongoose.model("Query", userSchema);
}

module.exports = Query;
