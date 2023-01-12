<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-11
   * @Description: 初始页面
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-12-16 10:03
   * @FilePath: ztm-earth-vue3/src/components/CesiumMap/index.js
   */
  import { onMounted, computed, markRaw } from "vue";
  import useInitCesiumMap from "@/hooks/useInitCesiumMap";
  import { useLoadingStore } from "@/stores/modules/loading";
  import { startLoading, endLoading } from "@/utils/loading";
  import CesiumNavigation from "@/hooks/useNavigation";
  import nProgress from "nprogress";
  import useCesium from "@/hooks/useCesium";

  const Cesium = useCesium();
  const appStore = useLoadingStore();
  const cesiumLoading = computed(() => appStore.getPageLoading);

  onMounted(async () => {
    try {
      startLoading();
      await useInitCesiumMap("cesiumContainer"); // 初始化cesium球体
      await CesiumNavigation(window.Viewer); // 初始化导航控件
      endLoading();
    } catch (err) {
      endLoading();
      throw err;
    }
  });
</script>
<style lang="less" scoped>
  #cesiumContainer {
    width: 100%;
    // 这里cesium球的高度必须为页面高度减去controls的高度，否则会导致cesium部分在页面下部不显示
    height: calc(100% - 12rem);
    margin: 0;
    padding: 0;
  }
</style>
