import axios from "axios";
import { showMessage } from "./status";

// 创建 axios 对象
const instance = axios.create({
  baseURL: "/", // 根路径
  timeout: 5000, // 网络延时
});

// 添加请求拦截器 => 前端给后端的参数【还没到后端响应】
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器 => 后端给前端的数据【后端返回给前端的东西】
instance.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return response;
    }
    // 增加错误信息处理
    showMessage(response.status);
    return response;
  },
  function (error) {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status);
      return Promise.reject(response.data);
    }
    showMessage("网络连接异常,请稍后再试!");
  }
);

// 最终返回的对象
export default instance;

/**
 * use example
 *  // get
    request({
      url: "/course/category/getSecondCategorys",
    }).then((res) => {
      console.log(res);
    });
   // post
   request({
      url: "/course/mostNew",
      method: "post",
      data: {
        pageNum: 1,
        pageSize: 5,
      },
    }).then((res) => {
      console.log(res);
    });
 */
