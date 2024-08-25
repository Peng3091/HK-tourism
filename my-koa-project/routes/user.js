//公共数据接口
/* 查询不同类型的用户*/
const router = require("koa-router")();
const User  = require("../models/user.js");
router.get("/api/user", async (ctx) => {
  try {
    const result = await User.find();
    ctx.body = {
      code: 200,
      msg: "请求成功",
      result,
    };
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 400,
      msg: "请求的参数不合法",
    };
  }
});
module.exports = router;
