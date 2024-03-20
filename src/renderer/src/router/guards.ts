export const beforeEach = async (to) => {
  if (to.path == '/login') {
    return
  }

  if (!localStorage.getItem('TOKEN')) {
    return '/login'
  }

  return true
}
//全局后置导航守卫
export const afterEach = () => {
  //...
  console.log('afterEach')
}
