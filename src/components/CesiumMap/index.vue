<template>
  <div
    v-loading="cesiumLoading"
    element-loading-text="Loading..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup>
  /**
   * @Author: 赵天铭
   * @Date: 2022-12-11
   * @Description: 初始页面
   * @LastEditors: 赵天铭
   * @LastEditTime: 2022-12-11 16:43
   * @FilePath: ztm-earth-vue3/src/components/CesiumMap/index.vue
   */
  import { onMounted, computed } from "vue";
  import useInitCesiumMap from "@/hooks/useInitCesiumMap";
  import { useAppStore } from "@/stores/modules/app";

  const appStore = useAppStore();
  const cesiumLoading = computed(() => appStore.getPageLoading);

  // 加载时的图标
  const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

  onMounted(async () => {
    await useInitCesiumMap("cesiumContainer");
  });
</script>
<style lang="less" scoped>
  #cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    /*overflow: hidden;*/
  }
</style>
