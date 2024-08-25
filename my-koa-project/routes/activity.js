/* 用户注册 */
import Router from "koa-router";
const router = new Router();
import Activity from "../models/activity";

router.get("/api/activity", async (ctx) => {
  try {
    const result = await Activity.find()
    ctx.body = {
        code: 200,
        msg: "请求成功",
        result,
      };
  } catch (error) {
    ctx.body = {
        code: 400,
        msg: "请求的参数不合法",
      };
  }
});
module.exports = router;