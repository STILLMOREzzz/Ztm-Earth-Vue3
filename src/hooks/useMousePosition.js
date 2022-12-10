/**
 * @Author: 赵天铭
 * @Date: 2022-12-10
 * @Description: 获取鼠标点击的屏幕坐标
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-10 10:33
 * @FilePath: ztm-earth-vue3/src/hooks/useMousePosition.js
 */

import { ref, onMounted, onBeforeUnmount } from "vue";

export default function useMousePosition() {
  const x = ref(-1);
  const y = ref(-1);
  const handler = (event) => {
    x.value = event.pageX;
    y.value = event.pageY;
  };
  onMounted(() => {
    window.addEventListener("click", handler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("click", handler);
  });

  return {
    x,
    y,
  };
}
