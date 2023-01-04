/**
 * @Author: STILLMOREzzz
 * @Date: 2022-12-06
 * @Description: 指令配置
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2022-12-31 18:55
 * @FilePath: ztm-earth-vue3/src/utils/directive/index.js
 */
import directObj from "./directiveConf";

export function setupDirective(app) {
  app.directive("cust-drag-dialog", {
    mounted(el, bindings, vnode, preVnode) {
      const domDragContainer = el.firstElementChild.firstElementChild;
      directObj.bind(domDragContainer);
      directObj.update(domDragContainer, bindings);
    }
  });
  /**
   * 增加指令来使窗口可拖拽，
   * DragButton 参数是窗口内头部标题 鼠标左键安装头部标题可拖动 填写类名
   * DragVindow 参数是窗口主体类名
   * custom:true 在自定义窗口时 默认居中显示
   * <div v-dragMove="{DragButton:'.window-header',DragVindow:'.window', custom:true}">
   *     <div class="window">
   *       <div class="window-header" >
   *         按住拖拽 标题
   *       </div>
   *     </div>
   *   </div>
   */
  app.directive("dragMove", (el, binding) => {
    // body当前宽度
    const screenWidth = document.body.clientWidth;
    // body高度
    const screenHeight = document.documentElement.clientHeight;
    // 拖拽按钮
    const DragButton = el.querySelector(binding.value.DragButton);
    DragButton.style.cssText += ";cursor:move;";
    // 拖拽窗口 DragVindow
    const DragVindow = el.querySelector(binding.value.DragVindow);
    // 如果是自定义组件 设置窗口默认居中
    if (binding.value.custom) {
      const [left, top] = [
        screenWidth - DragVindow.offsetWidth,
        screenHeight - DragVindow.offsetHeight
      ];
      DragVindow.style.cssText += `;left:${left / 2}px;top:${top / 2}px;`;
    }
    const sty = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })();

    // 按下鼠标处理事件
    DragButton.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - DragButton.offsetLeft;
      const disY = e.clientY - DragButton.offsetTop;

      const dragDomWidth = DragVindow.offsetWidth; // 对话框宽度
      const dragDomheight = DragVindow.offsetHeight; // 对话框高度

      const minDragDomLeft = DragVindow.offsetLeft;
      const maxDragDomLeft = screenWidth - DragVindow.offsetLeft - dragDomWidth;

      const minDragDomTop = DragVindow.offsetTop;
      const maxDragDomTop = screenHeight - DragVindow.offsetTop - dragDomheight;

      let styL = sty(DragVindow, "left");
      let styT = sty(DragVindow, "top");
      if (styL.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, "") / 100);
      } else {
        styL = +styL.replace(/px/g, "");
        styT = +styT.replace(/px/g, "");
      }
      document.onmousemove = (e) => {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }
        // 设置当前元素
        DragVindow.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  });
  app.directive("drag", (el, binding) => {
    const minWidth = 400;
    const minHeight = 300;
    // 拖拽按钮
    const dialogHeaderEl = el.querySelector(binding.value.DragButton);
    dialogHeaderEl.style.cssText += ";cursor:move;";
    // 拖拽窗口 DragVindow
    const dragDomBody = el.querySelector(binding.value.DragVindow);
    const dragDom = el.querySelector(binding.value.DragVindow);

    // 如果是自定义组件 设置窗口默认居中
    if (binding.value.custom) {
      const [left, top] = [
        screenWidth - DragVindow.offsetWidth,
        screenHeight - DragVindow.offsetHeight
      ];
      DragVindow.style.cssText += `;left:${left / 2}px;top:${top / 2}px;`;
    }
    // if (binding.value) {
    //   // 此部分的样式为单独编写 根据自己需求
    //   const leftDiv = document.createElement("div");
    //   leftDiv.id = "leftdiv";
    //   leftDiv.onmousedown = (e) => {
    //     Drag(e);
    //   };
    //   dragDomBody.appendChild(leftDiv);
    //   const rightDiv = document.createElement("div");
    //   rightDiv.id = "rightdiv";
    //   rightDiv.onmousedown = (e) => {
    //     Drag(e);
    //   };
    //   dragDomBody.appendChild(rightDiv);
    //   const bottomtDiv = document.createElement("div");
    //   bottomtDiv.id = "bottomtdiv";
    //   bottomtDiv.onmousedown = (e) => {
    //     Drag(e);
    //   };
    //   dragDomBody.appendChild(bottomtDiv);
    // }
    // dragDom.style.cssText += ';bottom:0px;'
    // 获取原有属性 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
      return (dom, attr) => getComputedStyle(dom, null)[attr];
    })();
    // 拖拉函数
    function Drag(ev) {
      // dragDom.style.userSelect = 'none';
      const clientX = ev.clientX;
      const clientY = ev.clientY;
      const elW = dragDom.clientWidth;
      const elH = dragDom.clientHeight;
      const EloffsetLeft = dragDom.offsetLeft;
      const EloffsetTop = dragDom.offsetTop;
      dragDom.style.userSelect = "none"; // 禁止内容被选中
      const ELscrollTop = el.scrollTop;
      document.onmousemove = function (e) {
        const modalContent = el.querySelector(".modal");
        console.log("modalContent", modalContent);

        e.stopPropagation(); // 移动时禁用默认事件
        // 左侧鼠标拖拽位置
        if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
          // 往左拖拽
          if (clientX > e.clientX) {
            dragDom.style.width = elW + (clientX - e.clientX) * 2 + "px";
          }
          // 往右拖拽
          if (clientX < e.clientX) {
            if (dragDom.clientWidth < minWidth) {
            } else {
              dragDom.style.width = elW - (e.clientX - clientX) * 2 + "px";
            }
          }
        }
        // 右侧鼠标拖拽位置
        if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
          // 往左拖拽
          if (clientX > e.clientX) {
            // eslint-disable-next-line no-empty
            if (dragDom.clientWidth < minWidth) {
            } else {
              dragDom.style.width = elW - (clientX - e.clientX) * 2 + "px";
            }
          }
          // 往右拖拽
          if (clientX < e.clientX) {
            dragDom.style.width = elW + (e.clientX - clientX) * 2 + "px";
          }
        }
        // 底部鼠标拖拽位置
        if (
          ELscrollTop + clientY > EloffsetTop + elH - 20 &&
          ELscrollTop + clientY < EloffsetTop + elH
        ) {
          // 往上拖拽

          if (clientY > e.clientY) {
            if (dragDom.clientHeight >= minHeight) {
              dragDom.style.height = elH - (clientY - e.clientY) * 2 + "px";
              modalContent.style.maxHeight = elH - (clientY - e.clientY) * 2 - 100 + "px";
            }
          }
          // 往下拖拽
          if (clientY < e.clientY) {
            dragDom.style.height = elH + (e.clientY - clientY) * 2 + "px";
            modalContent.style.maxHeight = elH + (e.clientY - clientY) * 2 - 100 + "px";
          }
        }
      };

      // 拉伸结束
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
    // 头部移动
    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      const screenWidth = document.body.clientWidth; // body 当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, "left");
      // 为兼容ie
      if (styL === "auto") styL = "0px";
      let styT = sty(dragDom, "top");

      // console.log(styL)
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, "") / 100);
      } else {
        styL = +styL.replace(/px/g, "");
        styT = +styT.replace(/px/g, "");
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false;
    };
  });
}
