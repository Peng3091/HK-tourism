<template>
  <div>
    <div
      v-for="(subItem, index) in subItems"
      :key="index"
      @click="toggleClick(index)"
      class="drop-item"
    >
      {{ subItem }}
    </div>
  </div>
</template>

<script setup>
import { defineProps,ref } from "vue";
import { useStore } from "../../../store";
const store = useStore();
const props = defineProps({
  subItems: {
    type: Array,
    required: true,
  },
});
let toggleClick = ref(() => {});
toggleClick = (index) => {
  if (index === 0) {
    store.setQueryType()
  } else if (index === 1) {
    store.setActivityRecom()
  } else if (index === 2) {
    store.setNotice()
  }
};
</script>

<style lang="scss" scoped>
.drop-item {
  padding: 10px 0;
  border-bottom: 1px solid rgb(204, 204, 204);
  &:last-child {
    border-bottom: none;
  }
}
.drop-item:hover {
  cursor: pointer;
  color: rgb(83, 146, 249);
  background-color: #f0f0f0;
}
</style>
