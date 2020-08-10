/*
路由里面只要有两种模式，hash和router
两个全局的组件 router-view 和 router-link
除此之外，我们每个组件里面还有两个属性 $router $route
最后，我们还需要 Vue.use 帮我们注册插件,使用 Vue.use 就会调用 install 方法
 */

class HistoryRoute {
    constructor(props) {
        this.current = null;
    }


}

class MyRouter {
    constructor(options) {
        //默认是hash 模式
        this.mode = options.mode || hash;
        this.routes = options.routes || [];
        //传递过来的是一个路由表， 为了方便后期的处理，我们需要对这个数组做一个改造：{'/home':Home,'/main':Main}
        this.routesMap = this.createMap(this.routes)
        //路由中需要存放当前的路径 需要状态,之所以把它做成一个类，是为了方便我们后期进行扩展
        this.history = new HistoryRoute;
        this.init()//开始初始化操作

    }
    init(){
        //首先需要判断路由使用的是什么模式
        if(this.mode === 'hash'){
            //先判断用户打开时有没有 hash，如果再有就跳转到 #/
            location.hash ? '' : location.hash = '/'
            //如果加载的时候就有hash值，我们就改变当前的url
            window.addEventListener('load',()=>{
                this.history.current = location.hash.slice(1);
            })
            //监听hash的变化
            window.addEventListener('hashchange',()=>{
                this.history.current = location.hash.split(1)
            })
        }else{
            location.pathname ? '' : location.pathname ='/';
            window.addEventListener('load',()=>{
                this.history.current = location.hash.slice(1);
            })
            window.addEventListener('popstate',()=>{
                this.history.current = location.hash.slice(1);
            })


        }

    }
    createMap(routes){
        return routes.reduce((memo,current)=>{
            memo[current.path] = current.component;
            return memo;
        },{})//初始化 memo 为空对象
    }


}
MyRouter.install = function (Vue,opts) {
    //每个组件都有 this.$router 和 this.$route 属性
    //既然每个组件上都有这两个属性，那我们就使用混入来解决这个问题

    //在所有组件中获取同一个路由的实例


    Vue.mixin({
        beforeCreate(){ //混合方法，会把这个方法和组件中的方法合成一个
            Object.defineProperty(this,'$router',{ //$router 就是 Router 的实例 ,就是 Vue Router 的实例
                get(){
                    return {}
                }
            })
            Object.defineProperty(this,'$route',{
                get(){
                    return {}
                }
            })
        }
    })

    //注册全局组件
    Vue.component('router-link',{
        //h === createElement
        render(h){
            //通过 h 渲染一个 a 标签，
            return h('a',{},'首页')
        }
    })
    Vue.component('router-view',{
        render(h){
            //通过 h 渲染一个 a 标签，
            return <h1>首页</h1>
        }
    })
}

export default MyRouter;