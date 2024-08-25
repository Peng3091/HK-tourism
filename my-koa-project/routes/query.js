/* 用户注册 */
import Router from "koa-router";
const router = new Router();
import Query from "../models/query";

router.post("/api/query", async (ctx) => {
  try {
    const formData = ctx.request.body;
    await Query.create(formData);
    ctx.status = 200;
    ctx.body = { message: "Query created successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "An error occurred while creating the query" };
    console.error(error);
  }
});
module.exports = router;
