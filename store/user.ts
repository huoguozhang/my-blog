import request from '~/client/api'

export const state = () => ({
  info: { }
})

export const mutations = {
  setInfo (state, info) {
    state.info = info
  }
}
export const actions = {
  async getUserInfo ({ commit }) {
    const data = await request.getCurrentUserInfo()
    commit('setInfo', data)
  }
}
