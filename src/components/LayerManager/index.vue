<template>
  <div class="one">
    <el-dialog
      draggable
      v-model="layerManagerShow"
      destroy-on-close
      @close="onClose"
      width="30%"
      :title="title"
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-tree :data="data" @node-click="handleNodeClick" />
    </el-dialog>
  </div>
</template>
<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-31
   * @Description: 图层管理
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-01-02 12:34
   * @FilePath: ztm-earth-vue3/src/components/LayerManager/index.js
   */
  import { reactive, ref, onMounted } from "vue";
  import { useLayerStore } from "@/stores/modules/layer";
  import { storeToRefs } from "pinia";

  const layerStore = useLayerStore();
  const { layerManagerShow } = storeToRefs(layerStore);

  const title = ref("图层管理");

  const onClose = () => {
    layerStore.closeLayerManagerShow();
  };
  const handleNodeClick = (data) => {
    console.log(data);
  };
  const data = reactive([
    {
      label: "Level one 1",
      children: [
        {
          label: "Level two 1-1",
          children: [
            {
              label: "Level three 1-1-1"
            }
          ]
        }
      ]
    },
    {
      label: "Level one 2",
      children: [
        {
          label: "Level two 2-1",
          children: [
            {
              label: "Level three 2-1-1"
            }
          ]
        },
        {
          label: "Level two 2-2",
          children: [
            {
              label: "Level three 2-2-1"
            }
          ]
        }
      ]
    },
    {
      label: "Level one 3",
      children: [
        {
          label: "Level two 3-1",
          children: [
            {
              label: "Level three 3-1-1"
            }
          ]
        },
        {
          label: "Level two 3-2",
          children: [
            {
              label: "Level three 3-2-1"
            }
          ]
        }
      ]
    }
  ]);
</script>
<style scoped lang="less">
  .one {
    pointer-events: none;
  }
  :deep(.el-dialog) {
    pointer-events: auto;
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
