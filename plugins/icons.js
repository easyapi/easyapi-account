import Vue from "vue";
// 引用组件
import SvgIcon from "@/components/SvgIcon/index.vue";

// 注册全局组件，组建名为svg-icon
Vue.component("svg-icon", SvgIcon);

// 引用svg图标
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
const req = require.context("@/icons/svg", true, /\.svg$/);
requireAll(req);
