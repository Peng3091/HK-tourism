const router = require("koa-router")();
import User from "../models/user";

router.delete("/api/delete", async (ctx) => {
  /* 三种不同用户登录 */
  //init.js已经检查了token(除了登录和注册), ctx.state.user 中包含的是解码后的 JWT 信息
  const { username, type } = ctx.query.body;
  const {type: userType} = ctx.state.user;
  try {
    const res = await User.findOne({ username: username, type: type});
    console.log(res);
    if (res) {
      if (userType!== "superAdmin") {
        ctx.body = {
          code: 400,
          msg: "没有权限删除",
        };
        return;
      }
      await User.deleteOne({ username: username, type: type });
      ctx.body = {
        code: 200,
        msg: "删除成功",
      };
    } else {//逻辑错误
      ctx.body = {
        code: 400,
        msg: "参数错误,删除失败",
      };
    }
  } catch (err) {//运行错误
    ctx.body = {
      msg: "请求参数不合法",
      code: 400,
    };
  }
});
module.exports = router;
