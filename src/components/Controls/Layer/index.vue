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
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 视图模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2023-01-12 15:07
   * @FilePath: ztm-earth-vue3/src/views/Controls/Layer/index.js
   */

  import language from "./index_local.js";
  import { ref, nextTick } from "vue";
  import { useLayerStore } from "@/stores/modules/layer";
  import { storeToRefs } from "pinia";

  const layerStore = useLayerStore();
  const { layerManagerShow: layerShow } = storeToRefs(layerStore);
  const lang = ref(language.ch);
  const onLayerManagerToggle = () => {
    nextTick(() => {
      layerStore.changeLayerManagerShow();
    });
  };
</script>
<style scoped lang="less">
  .layer-button {
    background: url("../../../assets/img/controls/layerTree.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .layer-button:hover,
  .layer-button-active {
    background: url("../../../assets/img/controls/layerTree_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
