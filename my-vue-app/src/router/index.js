import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/login.vue";
import Register from "../components/register.vue";
import AdminUser from "../components/adminUser/adminUser.vue";
import CommonUser from "../components/commonUser/commonUser.vue";
import {jwtDecode} from 'jwt-decode';
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/admin",
    name: "AdminUser",
    component: AdminUser,
    meta: { userType: ["admin", "superAdmin"], requiresAuth: true },
  },
  {
    path: "/common",
    name: "CommonUser",
    component: CommonUser,
    meta: { userType: "common", requiresAuth: true },
  },
];

// Create the router instance and pass the `routes` option
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    const userType = decodedToken.type;
    if (to.meta.requiresAuth && to.meta.userType !== userType) {
      next({ name: "Login" });
      //弹出提示框, 显示没有权限, 需要登录
      alert("没有权限，需要登录");
    } else {
      next();
    }
  } else if (to.meta.requiresAuth) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
