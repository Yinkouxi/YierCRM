import { defineStore } from 'pinia'
import { getInfo } from '@api/user'
import { Role, IUserInfo, Unit } from '@interface/user'
export const useUserStore = defineStore('userId', {
  state: (): {
    roles: Role[]
    rolePerm: string
    userInfo: Partial<IUserInfo>
    permissions: any,
    units:Partial<Unit>;

  } => {
    return {
      roles: [],
      rolePerm: '',
      userInfo: {},
      permissions: [],
      units: {}
    }
  },
  getters: {},
  actions: {
    async getUserInfo() {
      let res = await getInfo()
      let { permissions, roles, units, userInfo } = res.data

      //角色信息
      this.roles = roles
      this.rolePerm = roles[0].rolePerm

      //权限信息
      this.permissions = permissions

      //用户信息
      this.userInfo = userInfo

      //机构信息
      this.units = units;
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage, //默认走session
        paths: ['rolePerm', 'userInfo', 'permissions', 'units']
      }
    ]
  }
})
