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
      component: () => import('@/views/Login/login.vue'),
      meta: {
        hasNavbar: false,
        isToDesktop: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/Signup/signup.vue'),
      meta: {
        hasNavbar: false,
        isToDesktop: true
      },
      children: [
        {
          path: 'student',
          name: 'SignupStudent',
          component: () => import('@/views/Signup/SignupStudent/student.vue')
        },
        {
          path: 'teacher',
          name: 'SignupTeacher',
          component: () => import('@/views/Signup/signup.vue')//Mudar no futuro, estou colocando isso somente para sumir o erro
        }
      ]
    },
    {
      path: '/dashboard/:userId/:role',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/dashboard.vue'),
      meta: {
        hasNavbar: true,
        isToDesktop: true
      },
      children: [
        {
          path: 'add',
          name: 'AddEvent',
          component: () => import('@/views/Dashboard/dashboard.vue'),//Mudar no futuro, estou colocando isso somente para sumir o erro
          meta: {
            isToDesktop: false
          }
        },
        {
          path: ':eventId/edit',
          name: 'EditEvent',
          component: () => import('@/views/Dashboard/dashboard.vue'),//Mudar no futuro, estou colocando isso somente para sumir o erro
          meta: {
            isToDesktop: false
          }
        }
      ]
    },

  ],
})

export default router