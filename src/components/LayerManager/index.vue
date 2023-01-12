<template>
  <div class="one">
    <el-dialog
      draggable
      v-model="layerManagerShow"
      destroy-on-close
      @close="onClose"
      width="20%"
      :title="title"
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="layerTree"
        :data="layers"
        @node-click="handleNodeClick"
        :show-checkbox="true"
        node-key="id"
        default-expand-all
        :check-strictly="true"
        :default-checked-keys="defaultTree"
        @check-change="handleCheckChange"
      />
    </el-dialog>
  </div>
</template>
<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-31
   * @Description: 图层管理
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-01-04 21:23
   * @FilePath: ztm-earth-vue3/src/components/LayerManager/index.js
   */
  import { ref, watch } from "vue";
  import { useLayerStore } from "@/stores/modules/layer";
  import { storeToRefs } from "pinia";
  import useCesium from "@/hooks/useCesium";

  const Cesium = useCesium();
  const layerStore = useLayerStore();
  const { layerManagerShow, layers, defaultTree } = storeToRefs(layerStore);

  const title = ref("图层管理");

  // 点击图层管理框中关闭的事件
  const onClose = () => {
    layerStore.closeLayerManagerShow();
  };
  // 点击图层管理框中每一条数据的事件
  const handleNodeClick = (data) => {
    // console.log(data);
  };

  // 点击图层的复选框所触发的事件
  const handleCheckChange = (data) => {
    data.visible = !data.visible;
    layerStore.toggleCesiumData(data, window.Viewer);
  };

  // 监听图层管理器的开闭，并在每次开闭后重新计算defaultTree的值
  watch(layerManagerShow, () => {
    defaultTree.value.length = 0; // 清空defaultTree数组，在之后重新计算
    layerStore.calculateDefaultTree(layers.value);
  });
</script>
<style scoped lang="less">
  .one {
    pointer-events: none;
  }
  :deep(.el-dialog) {
    pointer-events: auto;
    left: -30%;
    top: 15%;
  }

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
