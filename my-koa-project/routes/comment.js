/* 用户注册 */
import Router from "koa-router";
const router = new Router();
import Comment from "../models/comment";

router.post("/api/comment", async (ctx) => {
  try {
    const formData = ctx.request.body;
    await Comment.create(formData);
    ctx.status = 200;
    ctx.body = { message: "Comment created successfully" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "An error occurred while creating the Comment" };
    console.error(error);
  }
});
module.exports = router;
