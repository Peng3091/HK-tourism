const Router = require("koa-router");
const AotoDir = require("require-directory");
const cors = require("koa2-cors");
const { koaBody } = require("koa-body");
const onerror = require("koa-onerror");
const logger = require("koa-logger");
const jwtKoa = require("koa-jwt");
//const views = require("koa-views");
//const json = require("koa-json");
const secret = "123456";

//const index = require("./routes/index");
//const users = require("./routes/users");
// 创建一个 MySQL 连接池

function initManage(app) {
  // error handler
  onerror(app);
  app.use(logger());
  app.use(cors());
  app.use(koaBody());

  //错误处理; 安全性通过模糊性
  app.use((ctx, next) => {
    return next().catch((err) => {
      if (401 == err.status) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          msg: "Protected resource, use Authorization header to get access",
        };
      } else {
        throw err;
      }
    });
  });
  // JWT
  app.use(
    jwtKoa({
      secret,
      debug: true, //可以显示错误信息
    }).unless({
      path: [/^\/api\/login/, /^\/api\/register/,/^\/api\/data/], //数组中的路径不需要通过jwt验证
    })
  );
  //koaBody设置, 实现文件上传; 只要是router实例, 就可以使用useRoutes方法
  const useRoutes = (obj) => {
    if (obj instanceof Router) {
      app.use(obj.routes(), obj.allowedMethods());
      //router.routes()返回一个中间件函数, 用于处理请求; router.allowedMethods()返回一个中间件函数, 用于对options请求进行响应
      //obj.allowedMethods()可以处理options请求(说明哪些请求可以执行), 也可以处理405错误(未定义请求)
    }
  };
  //自动注册路由; module是全局对象, 代表当前文件; process.cwd()是当前文件的目录
  AotoDir(module, process.cwd() + "/routes", {
    visit: useRoutes, //访问到每一个文件的时候, 都会调用useRoutes方法
  });
}

// routes
/* app.use(index.routes(), index.allowedMethods()) */
/* app.use(users.routes(), users.allowedMethods()) */

module.exports = initManage;
