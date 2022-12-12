<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
  /**
   * @Author: 赵天铭
   * @Date: 2022-12-11
   * @Description: 初始页面
   * @LastEditors: 赵天铭
   * @LastEditTime: 2022-12-11 18:52
   * @FilePath: ztm-earth-vue3/src/components/CesiumMap/index.vue
   */
  import { onMounted, computed } from "vue";
  import useInitCesiumMap from "@/hooks/useInitCesiumMap";
  import { useLoadingStore } from "@/stores/modules/loading";
  import { startLoading, endLoading } from "@/utils/loading";

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
      await useInitCesiumMap("cesiumContainer");
      endLoading();
    } catch (err) {
      throw err;
      endLoading();
    }
  });
</script>
<style lang="less" scoped>
  #cesiumContainer {
    /*overflow: hidden;*/
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
