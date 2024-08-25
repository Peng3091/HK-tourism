<template>
  <div class="container">
    <div class="login-form">
      <div class="login-box">
        <h1 class="title">Hong Kong Smart Tourism System</h1>
        <el-form :model="form" label-width="120px">
          <el-form-item class="type">
            <el-radio-group v-model="userType" size="large">
              <el-radio-button value="common">Tourist</el-radio-button>
              <el-radio-button value="admin">Admin</el-radio-button>
              <el-radio-button value="superAdmin">SuperAdmin</el-radio-button>
            </el-radio-group></el-form-item
          >
          <el-form-item label="Username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="Password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item class="submitBtn">
            <el-button type="primary" @click="login">Login in</el-button>
            <el-button type="default" @click="toRegister"
              >Register Now</el-button
            >
          </el-form-item>
        </el-form>
        <el-alert
          v-if="showAlert"
          title="Username or password is wrong, please re-inputpn!"
          type="error"
          class="alert"
          center
          show-icon
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../axiosConfig";
import { useRouter } from "vue-router";
const router = useRouter();
const form = ref({
  username: '',
  password: "",
});
const showAlert = ref(false);
const userType = ref("common");
const showError = () => {
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000); // 3秒后隐藏
};
const login = async () => {
  const res = await axios.post("/api/login", {
    username: form.value.username,
    password: form.value.password,
    type: userType.value,
  });
  //将token设置到localStorage中
  if (res.data.code !== 200) {
    showError();
    return;
  }
  localStorage.setItem("token", res.data.token);
  //跳转到首页
  router.push("/common");
};
const toRegister = () => {
  //跳转到注册页面
  router.push("/register");
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/HK.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.login-form {
  position: absolute; /* 使得内部元素以容器为参考 */
  width: 30%;
  min-width: 400px;
  //padding-top: 50%; /* 保持容器的高度为宽度的50%,这里只是为了获取高度的一半 */
  //height: 300px; /* 设置容器的高度为视口高度的50% */
  left: 50%; /* 设置左边距为视口宽度的50% */
  top: 50%; /* 设置顶边距为视口高度的50% */
  transform: translate(
    0,
    -50%
  ); /* 使用transform来将元素的中心点定位到视口的中心 */
  .login-box {
    //position: absolute; /* 使得内部元素以容器为参考 */
    top: 100px;
    left: 0;
    //height: 100%;
    width: 100%;
    padding: 20px;
    padding-top: 30px;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .title {
    text-align: center;
    //transform: translateX(50px);
    margin-bottom: 25px;
  }
  .el-form-item {
    margin-bottom: 20px;
    display: block;
    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }
    :deep(.el-form-item__label) {
      display: block;
    }
  }
  .type {
    :deep(.el-form-item__content) {
      display: flex !important;
      justify-content: center !important;
      :deep(.el-radio-group) {
        justify-content: space-around !important;
        :deep(.el-radio-button) {
          margin: 200px 0 !important;
        }
      }
    }
  }
  .submitBtn {
    :deep .el-button {
      display: block;
      margin: 0 0 10px 0;
      align-content: center;
      width: 100%;
    }
  }
  :deep(.el-radio-button__inner) {
    border: none !important;
    text-align: center;
  }
}
.alert {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  margin-left: 20px;
}
</style>
