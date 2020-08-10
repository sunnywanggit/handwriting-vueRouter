/*
路由里面只要有两种模式，hash和router
两个全局的组件 router-view 和 router-link
除此之外，我们每个组件里面还有两个属性 $router $route
最后，我们还需要 Vue.use 帮我们注册插件,使用 Vue.use 就会调用 install 方法
 */

class MyRouter {


}
MyRouter.install = function (Vue) {
    console.log(Vue,'install')
}

export default MyRouter;