<template>
  <div class="container">
    <!-- 创建新日程表的表单 -->
    <h2 style="margin: 15px auto; text-align: center">Trip planner</h2>
    <el-button class="btn1" type="primary" plain @click="closePlan"
      ><el-icon><Close /></el-icon
    ></el-button>
    <div class="new-plan-form">
      <h3>Create new itinerary</h3>
      <div class="search">
        <el-input
          v-model="newPlanName"
          style="width: 240px; flex: 2"
          placeholder="Itinerary Name"
        />
        <el-date-picker
          v-model="newPlanDates"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          style="flex: 3"
        />
        <button
          @click="createNewPlan"
          style="flex: 1; font-size: 14px; padding: 8px; line-height: 14px"
        >
          Create new
        </button>
      </div>
    </div>
    <!-- 日程表切换和删除按钮 -->
    <div class="plan-switcher">
      <h3>Your itinerary</h3>
      <div class="plans">
        <div v-for="(plan, index) in plans" :key="index">
          <button
            @click="switchPlan(index)"
            :class="{ active: currentPlanIndex === index }" style="margin-right: 4px;"
          >
            {{ plan.name }}
          </button>
          <el-button class="btn2" type="primary" plain @click="closeTable(index)"
            ><el-icon><Close /></el-icon
          ></el-button>
          <!-- 删除按钮 -->
        </div>
      </div>
    </div>
    <!-- 日程表详情和编辑 -->
    <div v-if="plans.length > 0">
      <div class="plan-container">
        <!-- 头部标签切换 -->
        <h3>
          {{ plans[currentPlanIndex].name }}
        </h3>
        <p style="color: #fff; font-size: 12px">{{ formattedDuration }}</p>
        <div class="tabs">
          <button
            v-for="n in plans[currentPlanIndex].days.length + 1"
            :key="n"
            :class="{ active: n === currentDay }"
            @click="setCurrentDay(n)"
          >
            <!-- 显示“全部”标签 -->
            {{
              n === plans[currentPlanIndex].days.length + 1 ? "All" : `Day ${n}`
            }}
          </button>
        </div>
        <!-- 修改逻辑以支持显示全部计划 -->
        <div v-if="currentDay <= plans[currentPlanIndex].days.length">
          <!-- 只显示当前选中的天的数据 -->
          <div
            class="day-plan"
            v-if="plans.length > 0 && plans[currentPlanIndex]"
          >
            <h3 style="margin-bottom: 10px">Day {{ currentDay }}</h3>
            <div class="input-container">
              <input
                v-model="newActivity.time"
                type="text"
                placeholder="Time"
              />
              <input
                v-model="newActivity.location"
                type="text"
                placeholder="Location"
              />
            </div>
            <div class="text-button">
              <textarea
                v-model="newActivity.notes"
                placeholder="Notes"
              ></textarea>
              <button @click="addToPlan(currentPlanIndex, currentDay)">
                Add to plan
              </button>
            </div>
          </div>
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              center
              :timestamp="activity.time"
              placement="top"
              v-for="(activity, index) in plans[currentPlanIndex].days[
                currentDay - 1
              ]"
              :key="index"
            >
              <el-card style="display: flex; position: relative">
                <div
                  style="
                    display: flex;
                    gap: 5px;
                    position: absolute;
                    top: -5px;
                    right: 4px;
                  "
                >
                  <button
                    style="font-size: 12px; padding: 4px 8px"
                    @click="editActivity(index)"
                  >
                    edit
                  </button>
                  <button
                    style="font-size: 12px; padding: 4px 8px"
                    @click="delActivity(index)"
                  >
                    delete
                  </button>
                </div>
                <h4>{{ activity.location }}</h4>
                <p>{{ activity.notes }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else>
          <!-- 外层循环遍历每一天 -->
          <div
            v-for="(day, dayIndex) in plans[currentPlanIndex].days"
            :key="dayIndex"
          >
            <!-- 将el-timeline移动到内层循环外部 -->
            <el-timeline style="max-width: 600px">
              <!-- 内层循环遍历每天的活动 -->
              <el-timeline-item
                v-for="(activity, index) in day"
                :key="index"
                placement="top"
                style="color: #fff"
                :timestamp="activity.time"
              >
                <el-card>
                  <h4>{{ activity.location }}</h4>
                  <p>{{ activity.notes }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div style="display: flex; gap: 15px">
          <button @click="savePlan">Save the itinerary</button>
          <button @click="resetPlan">Reset</button>
        </div>
        <!-- 添加重置按钮 -->
      </div>
    </div>
  </div>
</template>
<script setup>
// 导入 ref, computed
import { ref, computed } from "vue";
import { Close } from "@element-plus/icons-vue";
import { jwtDecode } from "jwt-decode";
import axios from "../../../../axiosConfig";
import { useStore } from "../../../../store/index";
const store = useStore();
//获取userId
const token = localStorage.getItem("token");
// 解码token
let decodedToken;
try {
  decodedToken = jwtDecode(token);
} catch (e) {
  console.error("Invalid token", e);
}
const userId = decodedToken.userId;
console.log(userId);
// 定义响应式数据
const plans = ref([]);
const newActivity = ref({
  time: "",
  location: "",
  notes: "",
});
const currentPlanIndex = ref(0);
const newPlanName = ref("");
const newPlanDates = ref("");
const currentDay = ref(1); // 定义当前天

const formattedDuration = computed(() => {
  const duration = plans.value[currentPlanIndex.value].duration;
  const startDate = new Date(duration[0]).toISOString().split("T")[0];
  const endDate = new Date(duration[1]).toISOString().split("T")[0];
  return `${startDate.replace(/-/g, ".")}--${endDate.replace(/-/g, ".")}`;
});
// 计算日期差
function calculateDays(newPlanDates) {
  const start = new Date(newPlanDates.value[0]);
  const end = new Date(newPlanDates.value[1]);
  if (start > end) {
    return 0; // 确保开始日期不晚于结束日期
  }
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // 包括结束日
}

function createNewPlan() {
  const daysCount = calculateDays(newPlanDates);
  console.log(daysCount);
  if (daysCount > 0) {
    // 确保有有效的天数
    createPlan(newPlanName.value, newPlanDates.value, daysCount, []);
  } else {
    alert("请确保开始日期早于结束日期，并且两者都已选择。");
  }
}

//拿到localstorage中token的user信息
// 修改 createPlan 函数以动态创建日程天数
function createPlan(name, duration, daysCount, activitiesPerDay) {
  plans.value.push({
    userId,
    name,
    duration,
    days: Array.from({ length: daysCount }).map((_, dayIndex) =>
      Array.from({ length: activitiesPerDay[dayIndex] || 0 }).map(() => ({
        time: "",
        location: "",
        notes: "",
      }))
    ),
  });
}

function closeTable(index) {
  console.log(userId, plans.value[index].name);
  // 使用查询参数而不是请求体发送数据
  axios.delete(
    `/api/plans?userId=${encodeURIComponent(userId)}&name=${encodeURIComponent(
      plans.value[index].name
    )}`
  );
  if (index >= 0 && index < plans.value.length) {
    plans.value.splice(index, 1);
  }
}
function switchPlan(index) {
  if (index >= 0 && index < plans.value.length) {
    currentPlanIndex.value = index;
  }
}

function setCurrentDay(day) {
  currentDay.value = day;
}
function addToPlan(planIndex, dayIndex) {
  const activity = { ...newActivity.value };
  plans.value[planIndex].days[dayIndex - 1].push(activity);
  // 清空临时数据以便下一次使用
  newActivity.value = { time: "", location: "", notes: "" };
  console.log(plans.value[planIndex].days);
  console.log(plans.value[planIndex].days);
}
function delActivity(index) {
  plans.value[currentPlanIndex.value].days[currentDay.value - 1].splice(
    index,
    1
  );
}
function editActivity(index) {
  // 将当前活动的数据填充到表单中
  newActivity.value = {
    ...plans.value[currentPlanIndex.value].days[currentDay.value - 1][index],
  };
  delActivity(index);
}
axios.get("/api/plans", { params: { userId } }).then((res) => {
  console.log(res.data.result);
  res.data.result.forEach((plan) => {
    plans.value.push(plan);
  });
});
const savePlan = async () => {
  // 实现保存日程表的逻辑
  const res = await axios.post("/api/plans", { userId, plan: plans.value });
  console.log(plans.value);
  console.log(res.data);
};

function resetPlan() {
  // 实现重置日程表的逻辑
  plans.value[currentPlanIndex.value].days[currentDay.value - 1] = [];
}
const closePlan = () => {
  store.setPlanTable();
};
</script>

<style lang="scss" scoped>
/* 基础布局样式 */
.container {
  overflow: auto;
  border-radius: 8px;
  box-shadow: 2px 8px 18px rgba(0, 0, 0, 0.2);
}
h3 {
  color: #fff;
}
.btn1 {
  position: absolute;
  right: 5px;
  top: 10px;
  padding: 5px;
  border: none;
  color: #000;
  font-size: 20px;
  cursor: pointer;
}
.new-plan-form,
.plan-switcher,
.plan-container {
  position: relative;
  margin-bottom: 20px;
  background: rgb(76, 157, 216);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.1);
}
.plans {
  display: flex;
  gap: 12px;
}
.search {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 15px;
}
.btn2 {
  padding: 5px;
  border: none;
  background-color: #fff;
  color: #000;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
}
.input-container {
  display: flex;
  justify-content: space-between;
}
input[type="text"] {
  width: 40%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box; /* 防止宽度超出容器 */
}
textarea {
  width: 60%;
  height: 60px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box; /* 防止宽度超出容器 */
}
.text-button {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  textarea {
    flex: 5;
  }
}

button {
  position: relative;
  background-color: #fff;
  color: #000;
  padding: 10px 20px;
  margin: 10px 0;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  color: #fff;
  background-color: #4285cc;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
  button {
    font-size: 12px;
    line-height: 12px;
  }
}

.tabs button {
  flex: 1;
  text-align: center;
}

.tabs .active {
  color: #fff;
  background-color: #0056b3;
}

.day-plan {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.day-plan:last-child {
  border-bottom: none;
}

.day-plan h3 {
  margin-top: 0;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .tabs button {
    padding: 10px 5px;
  }
}
:deep(.el-timeline-item__timestamp) {
  color: #fff !important;
}

.active {
  /* 这里定义激活状态的样式 */
  background-color: #0056b3;
  color: white;
}
</style>
