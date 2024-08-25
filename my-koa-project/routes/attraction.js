const Router = require('koa-router');
const pool = require('../database/db'); // 导入你的 MySQL 连接池
const router = new Router();

router.get('/api/data', async (ctx, next) => {
  const [rows, fields] = await pool.query('SELECT * FROM new_table');
  ctx.body = rows;
});

module.exports = router;