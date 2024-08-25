const router = require("koa-router")();
import User from "../models/user";
const jwt = require("jsonwebtoken");
const secret = "123456";
router.post("/api/login", async (ctx) => {
  /* 三种不同用户登录 */
  const { username, password, type } = ctx.request.body;
  try {
    const res = await User.findOne({
      username: username,
      password: password,
      type: type,
    });
    if (res) {
      let userToken = {
        userId: res._id,
        name: username,
        type: type,
      };
      /* 登录成功修改登录状态 */
      await User.updateOne({ username: username }, { isOnline: true });
      const token = jwt.sign(userToken, secret, {
        expiresIn: "1d",
      });
      ctx.body = {
        code: 200,
        msg: "登录成功",
        token,
      };
    } else {
      ctx.body = {
        code: 400,
        msg: "用户名或密码错误,登录失败",
      };
    }
  } catch (err) {
    console.log(err);
    ctx.body = {
      msg: "请求参数不合法",
      code: 400,
      err: err.message,
    };
  }
});
module.exports = router;
