<template>
  <div class="controls-template">
    <div class="controls-list" ref="container">
      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.visibilityAnalysis }}</span>
        <div class="list-item-btnbox" @click="toggleVisibilityAnalysisShow">
          <div
            class="list-item-btn visibilityAnalysis-button"
            :class="visibilityAnalysisShow ? 'visibilityAnalysis-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.visibilityAnalysis }}</span>
        </div>

        <div class="list-item-btnbox" @click="toggleVisualFieldAnalysisShow">
          <div
            class="list-item-btn visualFieldAnalysis-button"
            :class="visualFieldAnalysisShow ? 'visualFieldAnalysis-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.visualFieldAnalysis }}</span>
        </div>

        <div class="list-item-btnbox" @click="removeAll">
          <div class="list-item-btn remove-button"></div>
          <span class="list-item-name">{{ lang.remove }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2023-03-17
   * @Description: 分析模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2023-03-17 19:20
   * @FilePath: ztm-earth-vue3/src/views/Controls/Analysis/index.js
   */
  import language from "./index_local.js";
  import { ref } from "vue";

  const lang = ref(language.ch);
  const visibilityAnalysisShow = ref(false);
  const visualFieldAnalysisShow = ref(false);
  const toggleVisibilityAnalysisShow = () => {
    visibilityAnalysisShow.value = !visibilityAnalysisShow.value;
  };
  const toggleVisualFieldAnalysisShow = () => {
    visualFieldAnalysisShow.value = !visualFieldAnalysisShow.value;
  };

  const removeAll = () => {
    console.log("清除所有");
  };
</script>
<style scoped lang="less">
  .visibilityAnalysis-button {
    background: url("../../../assets/img/controls/visibilityAnalysis.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .visibilityAnalysis-button-active,
  .visibilityAnalysis-button:hover {
    background: url("../../../assets/img/controls/visibilityAnalysis_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .visualFieldAnalysis-button {
    background: url("../../../assets/img/controls/visualFieldAnalysis.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .visualFieldAnalysis-button-active,
  .visualFieldAnalysis-button:hover {
    background: url("../../../assets/img/controls/visualFieldAnalysis_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .remove-button {
    background: url("../../../assets/img/controls/remove.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .remove-button:hover {
    background: url("../../../assets/img/controls/remove_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
