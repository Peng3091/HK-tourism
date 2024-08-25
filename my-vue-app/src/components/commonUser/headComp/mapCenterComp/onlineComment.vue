<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <div class="parent">
      <el-text class="mx-1" size="large">Travel feedback</el-text>
    </div>
    <el-button class="btn" type="primary" plain @click="closeTable"
      ><el-icon><Close /></el-icon
    ></el-button>
    <el-form-item label="name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="contact" prop="contact">
      <el-input v-model="ruleForm.contact" />
    </el-form-item>
    <el-form-item label="Accompanied" prop="count">
      <el-select-v2
        v-model="ruleForm.count"
        placeholder="Accompanied"
        :options="options"
      />
    </el-form-item>
    <el-form-item label="Address" prop="Address">
      <el-select v-model="ruleForm.address" placeholder="Address">
        <el-option label="shanghai" value="shanghai" />
        <el-option label="beijing" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Duration" required>
      <el-form-item prop="dateTime">
        <el-date-picker
          v-model="ruleForm.dateTime"
          type="datetimerange"
          start-placeholder="Start date"
          end-placeholder="End date"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
          time-format="A hh:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
    </el-form-item>
    <el-form-item label="Feedback type" prop="type">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox value="Attractions" name="type"> Attractions </el-checkbox>
        <el-checkbox value="Ticketing" name="type"> Ticketing </el-checkbox>
        <el-checkbox value="Visa" name="type"> Visa </el-checkbox>
        <el-checkbox value="Trans & Accom" name="type">
          Trans & Accom
        </el-checkbox>
        <el-checkbox value="Cuisine" name="type"> Cuisine </el-checkbox>
        <el-checkbox value="Safety & Health" name="type">
          Safety & Health
        </el-checkbox>
        <el-checkbox value="User Experience" name="type">
          User Experience
        </el-checkbox>
        <el-checkbox value="Others" name="type"> Others </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Feedback" prop="content">
      <el-input v-model="ruleForm.content" type="textarea" />
    </el-form-item>
    <el-form-item label="Remarks" prop="remark">
      <el-input v-model="ruleForm.remark" type="textarea" />
    </el-form-item>
    <el-form-item style="text-align: center">
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Submit
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { Close } from "@element-plus/icons-vue";
interface RuleForm {
  name: string;
  contact: string;
  count: string;
  address: string;
  dateTime: string;
  type: string[];
  content: string;
  remark: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  contact: "",
  count: "",
  address: "",
  dateTime: "",
  type: [],
  content: "",
  remark: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input your name", trigger: "blur" },
    { min: 3, max: 10, message: "Length should be 3 to 10", trigger: "blur" },
  ],
  contact: [
    {
      required: true,
      message: "Please input your contact",
      trigger: "blur",
    },
    { min: 3, max: 20, message: "Length should be 3 to 15", trigger: "blur" },
  ],
  address: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  count: [
    {
      required: true,
      message: "Please select Activity count",
      trigger: "change",
    },
  ],
  dateTime: [
    {
      validator: (rule, value, callback) => {
        if (
          Array.isArray(value) &&
          value.length === 2 &&
          value.every((v) => v instanceof Date)
        ) {
          callback();
        } else {
          callback(new Error("Please pick a date"));
        }
      },
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one query type",
      trigger: "change",
    },
  ],
  content: [
    { required: true, message: "Please input query content", trigger: "blur" },
  ],
  remark: [
    { required: true, message: "Please input remarks", trigger: "blur" },
  ],
});
//发送请求
import axios from "../../../../axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useStore } from "../../../../store/index";
const store = useStore();
// token存储在localStorage中
const token = localStorage.getItem("token");
// 解码token
let decodedToken;
try {
  decodedToken = jwtDecode(token);
  console.log(decodedToken);
} catch (e) {
  console.error("Invalid token", e);
}
// 获取用户名
const username = decodedToken.name;
console.log(username);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const postData = async () => {
    try {
      // 数据提取
      const formData = {
        username: username,
        name: ruleForm.name,
        contact: ruleForm.contact,
        count: ruleForm.count,
        address: ruleForm.address,
        dateTimeRange: ruleForm.dateTime.toString(),
        feedback_type: ruleForm.type,
        feedback: ruleForm.content,
        remark: ruleForm.remark,
      };
      // 发送POST请求到你的API
      const response = await axios.post("/api/comment", formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      console.log(ruleForm);
      postData();
      store.setOnlineComment();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
const closeTable = () => {
  store.setOnlineComment();
};
</script>
<style lang="scss" scoped>
.btn {
  position: absolute;
  right: 5px;
  top: 10px;
  padding: 5px;
  border: none;
  color: #000;
  font-size: 20px;
  cursor: pointer;
}
.parent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.el-text {
  margin: auto;
  font-size: 25px;
  font-weight: bold;
}
</style>
