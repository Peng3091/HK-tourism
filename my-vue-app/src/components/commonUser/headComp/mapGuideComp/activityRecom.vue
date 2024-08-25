<template>
  <el-container>
    <div style="display: flex; justify-content: center">
      <h2 class="title">Events&Festivals</h2>
    </div>
    <el-button class="btn" type="primary" plain @click="closeTable"
      ><el-icon><Close /></el-icon
    ></el-button>
    <el-header class="header">
      <div class="search">
        <el-input v-model="searchName" placeholder="search the name"></el-input>
        <el-date-picker
          v-model="searchDate"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div class="tag-container">
        <el-tag
          type="primary"
          :class="{ 'is-active': selectedTypes.includes(type) }"
          class="flex gap-2 tags"
          v-for="type in types"
          :key="type"
          @click="selectType(type)"
        >
          {{ type }}
        </el-tag>
      </div>
    </el-header>
    <el-main class="main">
      <div class="infos">
        <div
          class="grid-content"
          v-for="event in paginatedEvents"
          :key="event._id.toString()"
        >
          <img :src="event.image" alt="活动图片" />
          <h4>{{ event.name }}</h4>
          <p>{{ event.date }}</p>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredEvents.length"
          :current-page="currentPage"
          :page-size="itemsPerPage"
          @current-change="changePage"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useStore } from "/src/store/index.js";
import axios from "/src/axiosConfig.js";
let selectedTypes = ref([]);
const store = useStore();
let currentPage = ref(1); // 当前页码
let itemsPerPage = ref(9); // 每页的项目数量
let searchName = ref("");
let searchDate = ref("");
let events = ref([]);
let types = ref([
  "Highlighted Events",
  "Chinese Opera",
  "Concerts",
  "Consumer Expos",
  "Dance performances",
  "Entertainment / Pop Culture",
  "Exhibitions",
  "Family Friendly / Edutainment",
  "Festivals",
  "Food & Drink",
  "Museums / Galleries / Public Spaces",
  "Music Performances",
  "Sports",
  "Stage Productions",
]);
function changePage(page) {
  currentPage.value = page;
}
function selectType(type) {
  let index = selectedTypes.value.indexOf(type);
  if (index !== -1) {
    selectedTypes.value.splice(index, 1); // 如果已经选中，那么再次点击就取消选中
  } else {
    selectedTypes.value.push(type); // 如果没有选中，那么点击就选中
  }
}
const closeTable = () => {
  store.setActivityRecom();
};
let filteredEvents = computed(() => {
  return events.value.filter((event) => {
    let [startDate, endDate] = event.date
      .split(" - ")
      .map((dateStr) => new Date(dateStr));
    let selectedDate = new Date(searchDate.value);
    return (
      event.name.includes(searchName.value) &&
      (!searchDate.value ||
        (selectedDate >= startDate && selectedDate <= endDate)) &&
      (selectedTypes.value.length === 0 ||
        selectedTypes.value.includes(event.type))
    );
  });
});
let paginatedEvents = computed(() => {
  let start = (currentPage.value - 1) * itemsPerPage.value;
  let end = start + itemsPerPage.value;
  return filteredEvents.value.slice(start, end);
});
console.log(paginatedEvents.value);
onMounted(() => {
  axios
    .get("/api/activity")
    .then(function (response) {
      // 请求成功，response.data 就是服务器返回的数据
      events.value = response.data.result;
    })
    .catch(function (error) {
      // 请求失败，error 是错误对象
      console.log(error);
    });
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
  height: auto;
  margin-top: 20px;
  margin-bottom: 10px;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
  }
  .tag-container {
    display: flex;
    justify-content: flex-start;
    align-items: space-around;
    flex-wrap: wrap;
    gap: 10px;
    .tags {
      cursor: pointer;
    }
    .is-active {
      color: #fff;
      background-color: #409eff;
    }
  }
}
.infos {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  .grid-content {
    border-radius: 4px;
    width: calc((100% - 50px) / 3);
    text-align: center;
    color: #000;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
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

.row-bg {
  padding: 10px 0;
  background-color: rgba(236, 245, 255);
}
</style>
