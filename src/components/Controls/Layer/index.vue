<template>
  <div class="controls-template">
    <div class="controls-list" ref="container">
      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.layerControl }}</span>
        <div class="list-item-btnbox" @click="onLayerManagerToggle">
          <div
            class="list-item-btn layer-button"
            :class="layerShow ? 'layer-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.layer }}</span>
        </div>
      </div>
    </div>
  </div>
  <layer-manager :layerShow="layerShow" @layer-toggle="onLayerManagerToggle"></layer-manager>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 视图模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-12-30 19:28
   * @FilePath: ztm-earth-vue3/src/views/Controls/Layer/index.js
   */

  import language from "./index_local.js";
  import { ref } from "vue";

  const lang = ref(language.ch);
  const layerShow = ref(false);

  const onLayerManagerToggle = () => {
    layerShow.value = !layerShow.value;
  };
</script>
<style scoped lang="less">
  .layer-button {
    background: url("../../../assets/img/controls/layerTree.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .layer-button-active {
    background: url("../../../assets/img/controls/layerTree_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
