<template>
  <div class="controls-template">
    <div class="controls-list" ref="container">
      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.geosot }}</span>
        <div class="list-item-btnbox" @click="toggleTestTilesetShow">
          <div
            class="list-item-btn test-tileset-button"
            :class="testTilesetShow ? 'test-tileset-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.test }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 瓦片模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-12-12 16:40
   * @FilePath: ztm-earth-vue3/src/views/Controls/Tileset/index.js
   */
  import language from "./index_local.js";
  import { onMounted, ref } from "vue";
  import { drawTilesetOBB } from "@/utils/geosot/boundingBox";
  import useCesium from "@/hooks/useCesium";

  const Cesium = useCesium();
  const lang = ref(language.ch);
  const testTilesetShow = ref(false);
  const viewer = window.Viewer;

  const toggleTestTilesetShow = async () => {
    testTilesetShow.value = !testTilesetShow.value;
    const testTileset = viewer.scene.primitives.get(0);
    drawTilesetOBB(testTileset, window.Viewer);
  };
</script>
<style scoped lang="less">
  .test-tileset-button {
    background: url("../../../assets/img/controls/test.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .test-tileset-button-active,
  .test-tileset-button:hover {
    background: url("../../../assets/img/controls/test_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
