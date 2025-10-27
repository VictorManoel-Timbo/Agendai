import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/login.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/Signup/signup.vue')
    }
  ],
})

export default router
