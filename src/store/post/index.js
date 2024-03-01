export const post = {
  namespaced: true,
  state() {
    return {
      showPopup: false,
    };
  },
  mutations: {
    CHANGE_SHOW_POPUP(state, isShow) {
      state.showPopup = isShow;
    },
  },
  actions: {},
};
