const router = require("koa-router")();
/* 查询所有的普通用户*/
import User from "../models/user";
/* 登出 */
router.post("/api/logout", async (ctx) => {
  /* 三种不同用户登录 */
  const { username, type } = ctx.request.body;
  const {type: userType} = ctx.state.user;
  console.log(type);
  try {
    const res = await User.findOne({ username: username, type: type});
    if (res) {
      if (userType !== type) {
        ctx.body = {
          code: 400,
          msg: "没有权限登出",
        };
        return;
      }
      /* 登出成功修改登录状态 */
      await User.updateOne({ username: username }, { isOnline: false });
      // await jsonfile.writeFile(process.cwd() + `/data/${type}.json`, result);
      ctx.body = {
        code: 200,
        msg: "登出成功",
      };
    } else {
      ctx.body = {
        code: 400,
        msg: "参数错误,登出失败",
      };
    }
  } catch (err) {
    ctx.body = {
      msg: "请求参数不合法",
      code: 400,
    };
  }
});
module.exports = router;
