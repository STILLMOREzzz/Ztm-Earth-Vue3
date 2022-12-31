<template>
  <div
    class="layer-manager"
    v-dragMove="{ DragButton: '.card-header', DragVindow: '.common-panel' }"
    v-show="layer.layerShow"
  >
    <el-card class="common-panel">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
          <el-button class="button" @click="onClose">
            <el-icon style="vertical-align: middle">
              <close />
            </el-icon>
          </el-button>
        </div>
      </template>
      45364
    </el-card>
  </div>
</template>
<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-31
   * @Description: 图层管理
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-12-31 12:06
   * @FilePath: ztm-earth-vue3/src/components/LayerManager/index.js
   */
  import { ref } from "vue";

  const layer = defineProps({
    layerShow: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(["layer-toggle"]);

  const title = ref("图层管理");

  const onClose = () => {
    emits("layer-toggle");
  };
</script>
<style scoped lang="less">
  .layer-manager {
    z-index: 990 - 20;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    pointer-events: none;
    left: 0;

    height: calc(100vh - 11rem);
    width: calc(100%);

    @media (min-width: @breakpoint) {
      left: @left-panel-width + 2rem;
      top: 9rem;
      right: 11rem;
      bottom: 0;
    }

    & > div {
      pointer-events: auto;
    }

    .common-panel {
      width: 48rem;
      left: 2rem;
      top: 20rem;
      position: relative;
      .card-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>
