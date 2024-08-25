//导入axios
import axios from "axios";
//配置axios
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.timeout = 5000;
//请求拦截
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // 如果 config.headers 未定义，初始化为一个空对象
    config.headers = config.headers || {};
    // 如果 config.headers.common 未定义，初始化为一个空对象
    //config.headers.common = config.headers.common || {};
    // 如果 token 存在，在每个 HTTP header 都加上 token
    // Bearer 是 JWT 的认证头部信息
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axios;
