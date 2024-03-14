export const beforeEach = async (_to: any) => {
  //...
  console.log('beforeEach')
  return true
}
//全局后置导航守卫
export const afterEach = () => {
  //...
  console.log('afterEach')
}
