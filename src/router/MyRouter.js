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
        this.routesMap = this.createMap(this.routes);
        //路由中需要存放当前的路径 需要状态,之所以把它做成一个类，是为了方便我们后期进行扩展
        this.history = new HistoryRoute;
        //开始初始化操作
        this.init();
    }

    init() {
        //首先需要判断路由使用的是什么模式
        if (this.mode === 'hash') {
            //先判断用户打开时有没有 hash，如果再有就跳转到对应的哈希路由，如果没有就调转到跟路由
            location.hash ? '' : location.hash = '/';
            //如果加载的时候就有hash值，我们就改变当前的url
            window.addEventListener('load', () => {
                this.history.current = location.hash.slice(1);
            });
            //监听hash的变化
            window.addEventListener('hashchange', () => {
                this.history.current = location.hash.slice(1);
            });
        } else {
            location.pathname ? '' : location.pathname = '/';
            window.addEventListener('load', () => {
                this.history.current = location.hash.slice(1);
            });
            window.addEventListener('popstate', () => {
                this.history.current = location.hash.slice(1);
            });
        }
    }

    createMap(routes) {
        return routes.reduce((memo, current) => {
            memo[current.path] = current.component;
            return memo;
        }, {});//初始化 memo 为空对象
    }
    go() { }
    back() { }
    push() { }
}

//当我们使用Vue.use(MyRouter)的时候，就会执行 MyRouter 的 install 方法
MyRouter.install = function (Vue, opts) {
    //每个组件都有 this.$router 和 this.$route 属性
    //既然每个组件上都有这两个属性，那我们就使用混入来解决这个问题
    //在所有组件中获取同一个路由的实例
    Vue.mixin({
        beforeCreate() { //mixin混合方法，会把这个方法和组件中的方法合成一个
            //定位跟组件 如果存在 $options 而且 $options 上存在 router ，则为根组件
            if (this.$options && this.$options.router) {
                this._root = this; //把当前实例挂载到当前实例的_root属性上
                this._router = this.$options.router;//把 router 挂载到当前实例的 _router属性上

                //observe方法 ,如果 history 中的 current 属性变化了，也会刷新视图
                //这里我们使用 defineReactive 来进行实现
                //this.xxx = this._router.history
                Vue.util.defineReactive(this, 'xxx', this._router.history);
            } else {
                //如果不是根节点，那么就是子或者孙子节点,Vue 组件的渲染顺序是 父->子->孙
                this._root = this.$parent._root;
                //如果想获取唯一的路由实例 this._root._router
            }

            Object.defineProperty(this, '$router', {
                //$router  ,就是 Vue Router 的实例
                //问题来了？ 我们怎么才能在组件中拿到同一个路由的实例呢？
                //在所有组件中，获取同一个路由的实例
                get() {
                    //我们在这里就可以拿到惟一的路由实例
                    return this._root._router;
                }
            });
            Object.defineProperty(this, '$route', {
                //$route 里面就应该有 curent 属性
                get() {
                    //当前路由所在的状态
                    current:this._root._router.history.current;
                }
            });
        }
    });

    //注册全局组件
    Vue.component('router-link', {
        //router-link 组件要接受一个 to 属性和一个 tag 属性
        props: { to: String, tag:String },
        methods:{
            handleClick(){
                //如果是 hash 怎么跳转，如果是 history 怎么跳转
            }
        },
        //h === createElement
        render(h) {
            //获取当前所使用的路由模式
            let mode = this._self._root._router.mode;
            let tag = this.tag;
            //this.$slots.default 取得是插槽中的默认插槽
            // return <tag on-click={this.handleClick} href={mode === 'hash' ? `#${this.to}` : this.to}>{this.$slots.default}</tag>
            return <a  href={mode === 'hash' ? `#${this.to}` : this.to}>{this.$slots.default}</a>
        }
    });
    Vue.component('router-view', {
        //根据当前的 current 去路由表中获取相应的组件 {'/home':Home}
        render(h) {
            //render 里面的  this  是proxy
            // console.log('this',this);
            //获取当前路由

            /*
            如何将 current 变成动态的 current ，currnet  变化应该会影响视图的刷新
            Vue 的时间绑定使用的是 Object.defineProperty ,当进行 set 的时候，就会刷新视图，所以我们可以在这里做文章
             */

            let current = this._self._root._router.history.current;
            let routerMap = this._self._root._router.routesMap;
            //根据路由表和对应的路径获取对应的组件，然后对组件进行渲染
            return h(routerMap[current]);
        }
    });
};

export default MyRouter;
