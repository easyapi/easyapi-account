import Cookies from "js-cookie";
import { getUser } from "@/api/account";

const state = () => ({
  userInfo: "",
});

const getters = {
  userInfo: (state) => state.userInfo,
};

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const actions = {
  /**
   * 获取用户信息
   */
  getUser({ commit, state }) {
    getUser(this).then((res) => {
      if (res.data.code === 1) {
        let userInfo = res.data.content;
        commit("SET_USER_INFO", userInfo);
      }
    });
  },
  /**
   * 登出
   */
  logout({ commit, state }) {
    Cookies.remove("authenticationToken");
    Cookies.remove("authenticationToken", {
      path: "/",
      domain: ".easyapi.com",
    });
    window.location.href =
      "https://account.easyapi.com/login/?from=https://team.easyapi.com";
  },
};

export default { state, getters, mutations, actions };
