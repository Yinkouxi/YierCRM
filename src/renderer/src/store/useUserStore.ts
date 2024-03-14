import { defineStore } from 'pinia'
export const useUserStore = defineStore('userId', {
  state: () => {
    return {
      userName: 'pinkMan',
      token:'dfaisdhcixa'
    }
  },
  getters:{},
  actions:{},
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['token']
      }
    ]
  }
})
