const Koa = require("koa");
const app = new Koa();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myDB");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("连接成功");
  const initManage = require("./config/init");
  initManage(app);
});

app.listen(3000, () => {
  console.log("App on port 3000");
});
