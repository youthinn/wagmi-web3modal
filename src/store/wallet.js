import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isWallet: false,
  }),
  persist: {
    enabled: true, // true 表示开启持久化保存
    strategies: [
      {
        key: 'walletInfo',
        storage: localStorage,
      },
    ],
  }
})
