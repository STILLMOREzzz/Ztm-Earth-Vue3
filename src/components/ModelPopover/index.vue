<template>
  <div class="two">
    <el-dialog
      draggable
      v-model="ModelPopoverShow"
      destroy-on-close
      @close="onClose"
      width="40%"
      :title="title"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div class="top-header">
        <el-input
          v-model="input"
          placeholder="请输入网格编码进行查询"
          class="search-box"
          :suffix-icon="Search"
          size="small"
        />
        <el-button class="search-button">搜索</el-button>
        <el-button class="search-button">绘制网格</el-button>
        <el-button class="search-button">加载模型</el-button>
      </div>
      <el-table :data="gridData" style="width: 100%">
        <el-table-column property="id" label="id" width="60" />
        <el-table-column property="name" label="Name" width="110" />
        <el-table-column property="x" label="x" width="110" />
        <el-table-column property="y" label="y" width="110" />
        <el-table-column property="gridCode" label="gridCode" width="110" />
        <el-table-column fixed="right" label="Operations" width="80">
          <template #default>
            <el-button link type="primary" size="small"> 加载数据 </el-button>
            <el-button link type="primary" size="small"> 绘制网格 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-31
   * @Description: 独立三维建筑模型信息展示
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-01-04 21:23
   * @FilePath: ztm-earth-vue3/src/components/LayerManager/index.js
   */
  import { onMounted, ref } from "vue";
  import { useModelPopoverStore } from "@/stores/modules/ModelPopover";
  import { storeToRefs } from "pinia";
  import useCesium from "@/hooks/useCesium";
  import { Search } from "@element-plus/icons-vue";
  import { getBeiJingList } from "@/api/gridCode";

  const Cesium = useCesium();
  const modelPopoverStore = useModelPopoverStore();
  const { ModelPopoverShow, beiJingData } = storeToRefs(modelPopoverStore);

  // 弹出框标题
  const title = ref("独立三维建筑模型信息管理");
  // 用于搜索框
  const input = ref("");
  // 点击图层管理框中关闭的事件
  const onClose = () => {
    modelPopoverStore.closeModelPopoverShow();
  };
  // 初始化gridData
  // 存储独立三维建筑模型的信息
  const gridData = ref([]);
  onMounted(() => {
    initData();
  });
  const initData = async () => {
    const { data: res } = await getBeiJingList();
    console.log(res);
    gridData.value = res;
  };
</script>
<style scoped lang="less">
  .two {
    pointer-events: none;
  }
  :deep(.el-dialog) {
    pointer-events: auto;
    left: -30%;
    top: 15%;
  }
  :deep(.el-dialog__body) {
    padding: 1rem 0;
  }
  .search-box {
    width: 20rem;
    margin-right: 1rem;
  }
  .top-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-left: 1rem;
  }
</style>
