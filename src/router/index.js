import {
    createRouter,
    createWebHistory,//history模式
    createWebHashHistory//hash模式
} from 'vue-router'

const router = new createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            redirect:'/home'
        },
        {
            path:'/home',
            name:"home",
            component:() => import('@/views/home/index.vue')
        },
        {
            path:'/hall',
            name:"hall",
            component:() => import('@/views/five-flag/index.vue')
        },
    ]
})

/**
 * 权限控制，动态路由添加等
 */
// router.beforeEach((to,from,next) => {
//     console.log(to,from,111);
//     next();
// })

export default router;