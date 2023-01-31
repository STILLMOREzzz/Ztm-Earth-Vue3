<template>
  <div class="controls-template">
    <div class="controls-list" ref="container">
      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.control }}</span>
        <div class="list-item-btnbox" @click="navigationShow = !navigationShow">
          <div
            class="list-item-btn navigation-button"
            :class="navigationShow ? 'navigation-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.navigation }}</span>
        </div>
      </div>

      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.location }}</span>
        <div class="list-item-btnbox" @click="flyToEarth">
          <div class="list-item-btn flyToEarth-button"></div>
          <span class="list-item-name">{{ lang.earth }}</span>
        </div>
        <div class="list-item-btnbox" @click="flyToChina">
          <div class="list-item-btn flyToChina-button"></div>
          <span class="list-item-name">{{ lang.china }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 开始模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2023-01-31 14:49
   * @FilePath: ztm-earth-vue3/src/views/Controls/Start/index.js
   */

  import language from "./index_local.js";
  import { ref, watch } from "vue";
  import { Cartesian3, Math } from "cesium";

  const lang = ref(language.ch);
  const navigationShow = ref(true);

  // 跳转到全球视角
  const flyToEarth = () => {
    window.Viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(110, 16, 20000000),
      orientation: {
        heading: Math.toRadians(0),
        pitch: Math.toRadians(-90),
        roll: 0.0
      },
      duration: 1
    });
  };

  // 跳转到中国视角
  const flyToChina = () => {
    window.Viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(109, 33.2, 5000000),
      orientation: {
        heading: Math.toRadians(0),
        pitch: Math.toRadians(-90),
        roll: 0.0
      },
      duration: 1
    });
  };

  watch(navigationShow, () => {
    navigationShow.value
      ? (document.getElementById("navigationDiv").style.visibility = "visible")
      : (document.getElementById("navigationDiv").style.visibility = "hidden");
  });
</script>
<style scoped lang="less">
  .navigation-button {
    background: url("../../../assets/img/controls/navigation.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .navigation-button:hover,
  .navigation-button-active {
    background: url("../../../assets/img/controls/navigation_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .flyToEarth-button {
    background: url("../../../assets/img/controls/earth.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .flyToEarth-button:hover,
  .flyToEarth-button-active {
    background: url("../../../assets/img/controls/earth_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .flyToChina-button {
    background: url("../../../assets/img/controls/china.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .flyToChina-button:hover,
  .flyToChina-button-active {
    background: url("../../../assets/img/controls/china_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
