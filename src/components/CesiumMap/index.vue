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
   * @FilePath: ztm-earth-vue3/src/components/CesiumMap/index.vue
   */
  import { onMounted, computed } from "vue";
  import useInitCesiumMap from "@/hooks/useInitCesiumMap";
  import { useLoadingStore } from "@/stores/modules/loading";
  import { startLoading, endLoading } from "@/utils/loading";
  import CesiumNavigation from "@/hooks/useNavigation";

  const appStore = useLoadingStore();
  const cesiumLoading = computed(() => appStore.getPageLoading);

  onMounted(async () => {
    /**
     * 应该直接用div包起<div id="cesiumContainer"></div>的时候，
     * 使用v-loading的时候使用cesiumLoading来判断，
     * 但是不知道为什么会导致页面下部有大片的白色部分，解决失败
     * 现在使用两个函数来控制
     * 2022.12.11 18:58
     */
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
