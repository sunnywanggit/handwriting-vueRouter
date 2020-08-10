/*
路由里面只要有两种模式，hash和router
两个全局的组件 router-view 和 router-link
除此之外，我们每个组件里面还有两个属性 $router $route
最后，我们还需要 Vue.use 帮我们注册插件,使用 Vue.use 就会调用 install 方法
 */

class MyRouter {
    constructor(options) {
        //默认是hash 模式
        this.mode = options.mode || hash;
        this.routes = options.routes || [];
        //传递过来的是一个路由表， 为了方便后期的处理，我们需要对这个数组做一个改造：{'/home':Home,'/main':Main}
        this.routesMap = this.createMap(this.routes)
        console.log(this.routesMap);
    }
    createMap(routes){
        return routes.reduce((memo,current)=>{
            memo[current.path] = current.component;
            return memo;
        },{})//初始化 memo 为空对象
    }


}
MyRouter.install = function (Vue) {
    console.log(Vue,'install')
}

export default MyRouter;