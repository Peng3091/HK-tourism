/* 用户注册 */
import Router from 'koa-router'; 
const router = new Router();
import { createId } from '../utils/createId'
import User from '../models/user'
/* 查询所有的普通用户*/
router.post("/api/register", async ctx => {
      const { username, password} = ctx.request.body;
      /* 只有不包含用户才添加 */
      const res = await User.findOne({ username: username });
      if (res) {
            ctx.body = {
                  code: 400,
                  msg: "用户名重复,请重新注册"
            }
      } else {
            if (password && username) {
                  var obj = {
                        id: createId(),
                        username,
                        password,
                        "type": "common",
                        "isOnline": false,
                  }
                  await User.create(obj)
                  ctx.body = {
                        code: 200,
                        msg: "注册成功"
                  }
            } else {
                  ctx.body = {
                        code: 400,
                        msg: "参数不合法"
                  }
            }
      }

})
module.exports = router;