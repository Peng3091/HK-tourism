<template>
  <div class="top-header">
    <div class="logo">
      <font-awesome-icon :icon="['fas', 'earth-asia']" class="icon" />
      <span class="title">HK Smart Tourism System</span>
    </div>
    <div class="key-module">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item-wrapper"
        :class="{ active: activeIndex === index }"
        @click="clickHead(index)"
        @mouseover="mouseOver(index)"
        @mouseleave="mouseLeave"
      >
        <div class="menu-item">
          {{ item.title }}
        </div>
        <div v-if="activeIndex === index && isLoaded == true" class="dropdown">
          <!-- <div
            v-for="(subItem, subIndex) in item.subItems"
            :key="subIndex"
            class="drop-item"
          >
            {{ subItem }}
          </div> -->
          <component :is="item.componentName" :subItems="item.subItems" />
        </div>
      </div>
    </div>
    <div class="mt-4 search">
      <el-input
        v-model="input"
        style="max-width: 600px"
        placeholder="Please input"
        class="input-with-select"
      >
        <template #prepend>
          <el-button :icon="Search" />
        </template>
        <template #append>
          <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option
              v-for="(item, index) in lists"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-input>
    </div>
    <div class="profile">
      <el-dropdown>
        <el-button type="primary">
          profile<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginOut">login out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed } from "vue";
import { useStore } from "../../store";
import { useRouter } from "vue-router";
import axios from "../../axiosConfig";
import { jwtDecode } from "jwt-decode";
import { Search } from "@element-plus/icons-vue";
import mapQuery from "./headComp/mapQuery.vue";
import mapPlan from "./headComp/mapPlan.vue";
import mapGuide from "./headComp/mapGuide.vue";
import mapCenter from "./headComp/mapCenter.vue";
const router = useRouter();
const select = ref("");
const input = ref("");
const store = useStore();
const isLoaded = computed(() => store.isLoaded);
const lists = [
  "Shek O Dragon's Back",
  "Tai O, Lantau Island",
  "Tai Lam Country Park",
  "Sai Kung Man Yee Geological Trail",
  "Tai Mo Shan, New Territories",
  "Sai Kung Tai Long Wan",
  "Pat Sin Leng, New Territories North",
  "MacLehose Trail Stage 4",
  "Pat Sin Leng Nature Trail Stage 9",
  "Stanley Main Beach to Shek O",
  "Bride's Pool",
  "Ngong Ping",
  "Sheung Mun Reservoir",
  "MacLehose Trail Section 1 to 2",
  "Eagle's Nest Nature Trail",
  "Pak Tam Chung to Sheung Chung",
  "Tsing Yi Nature Trail",
  "Pak Sha Wan to Big Wave Bay",
  "Pok Fu Lam to Victoria Peak",
  "Wilson Trail",
  "Wan Chai Gap Road",
  "Western Mid-levels Route",
  "Kennedy Town",
  "Chun Yeung Street, North Point",
  "Choi Hung Estate",
  "Goldfish Market",
  "Apliu Street",
  "Lee Tung Street",
  "Nathan Road",
  "Hollywood Road",
  "Duddell Street",
  "Stanley Market",
  "D'Aguilar Street",
  "Hong Kong Museum of History",
  "Hong Kong Maritime Museum",
  "Sun Yat Sen Museum",
  "Law Uk Folk Museum",
  "Hong Kong Heritage Discovery Centre",
  "Golden Bauhinia Square",
  "Hong Kong Cultural Centre",
  "West Kowloon Cultural District",
  "Hong Kong Museum of Art",
  "Hong Kong Academy for Performing Arts",
  "Hong Kong Opera House",
  "Hong Kong Coliseum",
  "Hong Kong Arts Centre",
  "Hong Kong Public Library",
  "Hong Kong Space Museum",
  "University of Hong Kong",
  "Chinese University of Hong Kong",
  "Hong Kong University of Science and Technology",
  "City University of Hong Kong",
  "Hong Kong Polytechnic University",
  "Education University of Hong Kong",
  "Hong Kong Academy for Performing Arts",
  "Hong Kong Academy of Music",
  "Tian Tan Buddha",
  "Man Mo Temple",
  "Ten Thousand Buddhas Monastery",
  "Temple of the North God",
  "Che Kung Temple",
  "Tin Hau Temple",
  "Chilin Nunnery",
  "St. John's Cathedral",
  "Rose Chapel, Tsim Sha Tsui",
  "St. Margaret's Church",
  "St. Andrew's Church",
  "Chinese Rhenish Church",
  "Masjid Street Mosque",
  "Jamia Mosque",
  "Kowloon Mosque",
  "Chai Wan Mosque",
  "Hong Kong Disneyland",
  "Ocean Park",
  "Noah's Ark",
  "Temple Street",
  "Lan Kwai Fong",
  "Hong Kong Film Archive",
  "Broadway Cinematheque",
  "Avenue of Stars",
  "Victoria Harbour",
  "Central Market",
  "Central Ferris Wheel",
  "Mid-levels Escalator",
  "Sky100",
  "Sha Tin Racecourse",
  "Happy Valley",
  "Peak Tram",
  "Star Ferry",
  "Repulse Bay",
  "Clock Tower",
  "Old Town Central",
  "Landmark",
  "SOGO Department Store",
  "Pacific Place",
  "Times Square",
  "New Town Plaza",
  "Langham Place",
  "Ladies' Market",
  "Sneakers Street",
  "Stanley Market",
  "Duck Shing Ho Street",
  "International Financial Centre",
  "Elements Shopping Mall",
  "K11 Musea",
];
const menuItems = ref([
  {
    title: "Spot Inquiry",
    componentName: shallowRef(mapQuery),
    subItems: [
      { label: "Spot Introduction", tooltip: "这是子项1的提示" },
      { label: "Spot Display", tooltip: "这是子项1的提示" },
      { label: "Area Search", tooltip: "这是子项1的提示" },
      { label: "Customized Query", tooltip: "这是子项1的提示" },
    ],
  },
  {
    title: "Itinerary Planning",
    componentName: shallowRef(mapPlan),
    subItems: ["Local Travel Groups", "Itinerary Recommendations", "Itinerary Planning Table"],
  },
  {
    title: "Entertainment Guide",
    componentName: shallowRef(mapGuide),
    subItems: ["Entertainment Types", "Activity Recommendations", "Important Announcements"],
  },
  {
    title: "Consultation Service",
    componentName: shallowRef(mapCenter),
    subItems: ["Online Consultation", "Consultation Center", "Travel Feedback"],
  },
]);

let activeIndex = ref(-1);
let timer = ref(null);
const clickHead = (index) => {
  clearTimeout(timer.value);
  activeIndex.value = index;
};
const mouseOver = (index) => {
  clearTimeout(timer.value);
  activeIndex.value = index;
};

const mouseLeave = () => {
  timer.value = setTimeout(() => {
    activeIndex.value = -1;
  }, 500); // 500ms 的延迟
};
const token = localStorage.getItem("token");
let decodedToken;
try {
  decodedToken = jwtDecode(token);
} catch (e) {
  console.error("Invalid token", e);
}
const loginOut = () => {
  axios
    .post("/api/logout", {
      username: decodedToken.name,
      type: decodedToken.type,
    })
    .then((response) => {
      // 处理响应
      localStorage.removeItem("token");
      router.push({ path: "/" });
    })
    .catch((error) => {
      // 处理错误
      console.error(error);
    });
};
</script>
<style lang="scss" scoped>
.top-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 30px;
  background: #fff; /* 设置背景色 */
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 设置下方阴影 */
}
.logo {
  display: flex;
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  .icon {
    color: rgb(83, 146, 249);
    margin-right: 5px;
  }
  .title {
    font-size: 18px;
  }
}
.logo:hover {
  cursor: pointer;
}
.key-module {
  display: flex;
  flex: 3;
  justify-content: space-between;
  background: #fff; /* 设置背景色 */
  //box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 设置下方阴影 */
  //hover才加阴影
}
.search {
  flex: 1;
}
.profile {
  flex: 0.5;
  text-align: right;
}
.top-header:hover {
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2); /* 设置下方阴影 */
}
.menu-item-wrapper {
  position: relative;
  padding: 20px 0 16px 0;
  color: #333;
  border-bottom: 4px solid transparent;
  &::after {
    /* 在每个菜单项后添加一个朝下的三角形 */
    content: "";
    position: absolute;
    right: -10px;
    top: 50%;
    //transform: translateY(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
}
.menu-item-wrapper:hover .menu-item {
  cursor: pointer;
  color: rgb(83, 146, 249);
}
.menu-item-wrapper:hover {
  border-bottom: 4px solid rgb(83, 146, 249);
  transition: 0.3s ease-in-out;
}
.menu-item-wrapper.active .menu-item {
  color: rgb(83, 146, 249);
}
.dropdown {
  position: absolute;
  z-index: 10000;
  top: calc(100% + 4px);
  left: 0;
  width: 150%;
  transform: translateX(-12.5%);
  //设置阴影
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1); /* 设置下方阴影 */
  text-align: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid rgb(204, 204, 204);
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
