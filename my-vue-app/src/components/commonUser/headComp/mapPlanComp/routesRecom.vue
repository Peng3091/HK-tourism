<template>
  <el-container>
    <div style="display: flex; justify-content: center">
      <h2 class="title">Excursions&tours</h2>
    </div>
    <el-button class="btn" type="primary" plain @click="closeTable"
      ><el-icon><Close /></el-icon
    ></el-button>
    <el-header class="header">
      <div class="search">
        <div class="search-son">
          <p>Duration</p>
          <el-select v-model="selectedDuration" multiple placeholder="Select">
            <el-option
              v-for="item in options_time"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-son">
          <p>Theme</p>
          <el-select v-model="selectedTheme" multiple placeholder="Select">
            <el-option
              v-for="item in options_theme"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="infos">
        <div
          class="grid-content"
          v-for="event in paginatedEvents"
          :key="event.id"
        >
          <img
            style="height: 200px; width: auto; object-fit: cover"
            :src="event.image"
            alt="活动图片"
          />
          <h4>{{ event.name }}</h4>
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
import { ref, computed } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useStore } from "/src/store/index.js";
import { travelRoutes } from "../../../../data/routes";
let selectedDuration = ref([]);
let selectedTheme = ref([]);
const store = useStore();
let currentPage = ref(1); // 当前页码
let itemsPerPage = ref(9); // 每页的项目数量
let events = ref(travelRoutes);
console.log(events.value);
const options_time = [
  {
    value: "Less than 4 hours",
    label: "Less than 4 hours",
  },
  {
    value: "4-8 hours",
    label: "4-8 hours",
  },
  {
    value: "more than 8 hours",
    label: "more than 8 hours",
  },
];
const options_theme = [
  {
    value: "Highlighted Itineraries",
    label: "Highlighted Itineraries",
  },
  {
    value: "Fun Water Adventure",
    label: "Fun Water Adventure",
  },
  {
    value: "Great Green Escapes",
    label: "Great Green Escapes",
  },
  {
    value: "Unconventional Journey",
    label: "Unconventional Journey",
  },
  {
    value: "HK Pop Culture",
    label: "HK Pop Culture",
  },
  {
    value: "Legacy of Joy",
    label: "Legacy of Joy",
  },
  {
    value: "Journey Through National History",
    label: "Journey Through National History",
  },
];
function changePage(page) {
  currentPage.value = page;
}
const closeTable = () => {
  store.setRoutesRecom();
};
let filteredEvents = computed(() => {
  return events.value.filter((event) => {
    return (
      (selectedTheme.value.length === 0 ||
        selectedTheme.value.includes(event.theme)) &&
      (selectedDuration.value.length === 0 ||
        selectedDuration.value.includes(event.duration))
    );
  });
});
console.log(filteredEvents.value);
let paginatedEvents = computed(() => {
  let start = (currentPage.value - 1) * itemsPerPage.value;
  let end = start + itemsPerPage.value;
  return filteredEvents.value.slice(start, end);
});
console.log(paginatedEvents.value);
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
    .search-son {
      flex-grow: 1;
    }
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
