import Vue from "vue";
import { getInfo, login, logout } from "@/api/user";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/utils/accessToken";
import { resetRouter } from "@/router";
import defaultSettings from "@/config/settings";
const state = { accessToken: getAccessToken(), userName: "", permissions: [] };
const mutations = {
  setAccessToken: (state, accessToken) => {
    state.accessToken = accessToken;
  },
  setUserName: (state, userName) => {
    state.userName = userName;
  },
  setPermissions: (state, permissions) => {
    state.permissions = permissions;
  },
};
const actions = {
  login({ commit }, userInfo) {
    const { userName, password } = userInfo;
    return new Promise((resolve, reject) => {
      const { accessToken } = {accessToken:"admin-accessToken"};
      commit("setAccessToken", accessToken);
      setAccessToken(accessToken);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8
          ? "早上好"
          : hour <= 11
          ? "上午好"
          : hour <= 13
            ? "中午好"
            : hour < 18
              ? "下午好"
              : "晚上好";
      Vue.prototype.$baseNotify(
        `欢迎登录${defaultSettings.title}`,
        `${userName}，${thisTime}！`
      );
      resolve();
    });
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.accessToken)
      //   .then((response) => {
      //     // const { data } = response;
      //
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
      const { data } = {code:200,msg:"success",data:{permissions:["admin"],userName:"admin"}}
      if (!data) {
        reject("验证失败，请重新登录...");
      }
      let { permissions, userName } = data;
      commit("setPermissions", permissions);
      commit("setUserName", userName);
      resolve(data);
    });
  },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.accessToken)
        .then(() => {
          commit("setAccessToken", "");
          commit("setPermissions", []);
          removeAccessToken();
          resetRouter();
          dispatch("tagsBar/delAllViews", null, { root: true });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  resetAccessToken({ commit }) {
    return new Promise((resolve) => {
      commit("setAccessToken", "");
      removeAccessToken();
      resolve();
    });
  },
};
export default { state, mutations, actions };
