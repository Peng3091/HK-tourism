import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { ArrowDown} from '@element-plus/icons-vue'
import VTooltip from 'v-tooltip'

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEarthAsia as fasEarthAsia } from "@fortawesome/free-solid-svg-icons";
library.add(fasEarthAsia);

import router from "./router";
import "./style.css";
import App from "./App.vue";
const pinia = createPinia();
export const app = createApp(App)
app.use(router).use(VTooltip).use(pinia).use(ElementPlus).mount("#app");
app.component("font-awesome-icon", FontAwesomeIcon);
app.component('arrow-down', ArrowDown)

