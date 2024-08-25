// 导入 mongoose 模块
const mongoose = require("mongoose");
const { Schema } = mongoose;

// 直接在 daySchema 中定义活动的结构
const planSchema = new Schema({
  userId: String,
  name: String,
  duration: [Date],
  days: [[{
    // 直接在这里定义对象的结构
    // 例如:
    time: String,
    location: String,
    notes: String,
    // 可以根据需要添加更多字段
  }]],
});

let Plans;
if (mongoose.models.Plans) {
  Plans = mongoose.model("Plans");
} else {
  Plans = mongoose.model("Plans", planSchema);
}

module.exports = Plans;