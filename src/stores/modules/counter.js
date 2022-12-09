/**
 * @Author: 赵天铭
 * @Date: 2022-12-06
 * @Description: vite初始化的pinia示例
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-06
 * @FilePath: ztm-earth-vue3/src/stores/modules/counter.js
 */
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
