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
    </div>
  </div>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 开始模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-12-16 0:35
   * @FilePath: ztm-earth-vue3/src/views/Controls/Start/index.js
   */

  import language from "./index_local.js";
  import { ref, watch } from "vue";

  const lang = ref(language.ch);
  const navigationShow = ref(true);

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
  .navigation-button-active {
    background: url("../../../assets/img/controls/navigation_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
