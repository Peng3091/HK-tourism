<template>
  <el-container>
    <div style="display: flex; justify-content: center">
      <h2 class="title">Traveller essentials</h2>
    </div>
    <el-button class="btn" type="primary" plain @click="closeTable"
      ><el-icon><Close /></el-icon
    ></el-button>
    <el-header class="header">
      <div class="search">
        <el-input v-model="searchName" placeholder="search information"></el-input>
      </div>
      <div class="block text-center">
        <el-carousel height="150px">
          <el-carousel-item v-for="item in news" :key="item" :style="{
            background: `url('${item.image}') no-repeat center center / cover`,
          }">
            <h3 class="small justify-center slide" text="2xl">{{ item.title }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-header>
    <el-main class="main">
      <h4>Before you arrive</h4>
      <div class="infos">
        <div
          class="grid-content"
          v-for="event in beforeEvents"
          :key="event.id"
          :style="{
            background: `url('${event.image}') no-repeat center center / cover`,
          }"
        >
          <h4>{{ event.title }}</h4>
        </div>
      </div>
      <hr />
      <h4>On arrival</h4>
      <div class="infos">
        <div
          class="grid-content"
          v-for="event in onEvents"
          :key="event.id"
          :style="{
            background: `url('${event.image}') no-repeat center center / cover`,
          }"
        >
          <h4>{{ event.title }}</h4>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useStore } from "/src/store/index.js";
import axios from "/src/axiosConfig.js";
const store = useStore();
let searchName = ref("");
let news = ref([]);
let beforeEvents = ref([
  {
    id: 1,
    title: "Travel health advice",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/travel-health-advice/travel-health-advice-960x720.jpg",
  },
  {
    id: 2,
    title: "How to get to Hong Kong",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/how-to-get-to-hong-kong/get-to-hk-4-3.jpg",
  },
  {
    id: 3,
    title: "Immigration & Customs",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/immigration-and-custom/immigrations_and_customs_680x480.jpg",
  },
  {
    id: 4,
    title: "Good to know",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/good-to-know/good-to-know-4-3.jpg",
  },
  {
    id: 5,
    title: "Travel apps",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/travel-apps/travel_apps_680x480.jpg",
  },
  {
    id: 6,
    title: "E-guidebooks",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/e-guidebooks/e-guidebooks_680x480.jpg",
  },
]);
let onEvents = ref([
  {
    id: 1,
    title: "Get online",
    image:
      "	https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/get-online/get_online_680x480.jpg",
  },
  {
    id: 2,
    title: "Health & hygiene",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/health-and-hygine/health-and-hygiene_680x480.jpg",
  },
  {
    id: 3,
    title: "Culture & Customs",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/custom-and-culture/customs-and-culture_680x480.jpg",
  },
  {
    id: 4,
    title: "Shopping tips",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/shopping-and-dining-tips/shopping-and-dining-tips_680x480.jpg",
  },
  {
    id: 5,
    title: "Dining tips",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/shopping-and-dining-tips/dining-tips-640x480.jpg",
  },
  {
    id: 6,
    title: "Visitor centres",
    image:
      "https://www.discoverhongkong.com/content/dam/dhk/intl/plan/traveller-info/visitor-information-services/vistor-info-services-4-3.jpg",
  },
]);
const closeTable = () => {
  store.setNotice();
};
onMounted(() => {
  axios.get("/api/news").then((res) => {
    news.value = res.data.result;
  }).catch((err) => {
    console.log(err);
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
  margin-bottom: 5px;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
  }
}
.el-carousel__item h3 {
  display: inline-block;
  background: rgba(0, 0, 0, 0.5); 
  color: transparent;
  color: #fff;
  opacity: 0.75;

  line-height: 1;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.main {
  h4 {
    margin-bottom: 10px;
  }
  hr {
    margin: 15px 0;
    color: #000;
    width: 80%;
    height: 1px;
    margin-left: 10%;
  }
}
.infos {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  .grid-content {
    position: relative;
    border-radius: 4px;
    width: calc((100% - 50px) / 3);
    height: 100px;
    text-align: center;
    color: #000;
    img {
      position: relative;
      max-width: 100%;
      max-height: 100%;
    }
    h4 {
      position: absolute;
      bottom: 5px; /* 调整这个值来改变标题的垂直位置 */
      left: 5px; /* 调整这个值来改变标题的水平位置 */
      color: white;
      font-size: 14px;
      background-color: rgba(0, 0, 0, 0.3);
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
