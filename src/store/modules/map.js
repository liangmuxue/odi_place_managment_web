const state = {
  mapShow: false
}

const mutations = {
  SHOW_MAP: (state) => {
    state.mapShow = true
  },
  CLOSE_MAP: (state) => {
    state.mapShow = false
  }
}

const actions = {
  showMap({ commit }) {
    commit('SHOW_MAP')
  },
  closeMap({ commit }) {
    commit('CLOSE_MAP')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
