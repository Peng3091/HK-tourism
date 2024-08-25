/* 用户注册 */
import Router from "koa-router";
const router = new Router();
import Plans from "../models/plans";

router
  .get("/api/plans", async (ctx) => {
    try {
      const { userId } = ctx.query;
      console.log(userId);
      const result = await Plans.find({
        userId: userId,
      });
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
  })
  .post("/api/plans", async (ctx) => {
    try {
      const { userId, plan } = ctx.request.body;
      // 查询现有文档
      const existingPlan = await Plans.findOne({ userId });
      if (existingPlan) {
        // 如果存在，删除现有文档
        await Plans.deleteOne({ userId });
      }
      // 创建新文档
      const newPlan = await Plans.create(plan);
      console.log(newPlan);
      // 返回成功响应
      ctx.body = {
        code: 200,
        message: "计划更新成功",
        data: newPlan,
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 500,
        message: "服务器错误",
      };
    }
  })
  .delete("/api/plans", async (ctx) => {
    try {
      const { userId, name } = ctx.query;
      console.log(userId, name);
      const result = await Plans.deleteOne({ userId: userId, name: name });
      console.log(result);
    } catch (error) {
      ctx.body = {
        code: 400,
        msg: "请求的参数不合法",
        error,
      };
    }
  });
module.exports = router;
