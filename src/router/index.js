import MyRouter from './MyRouter.js'
import Vue from 'vue'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'

Vue.use(MyRouter)

//VueRouter 是一个类，我们在使用之前，首先需要实例化这个类
export default new MyRouter({
    mode:'hash',
    routes:[
        {path:'/home',component:Home},
        {path:'/main',component:Main},
    ]
})