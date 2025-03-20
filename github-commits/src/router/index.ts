import { useAuth } from '@/modules/auth'
import { createRouter, createWebHistory } from 'vue-router'
import  HomeView  from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import ListRepositories from '@/views/ListRepositories.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',    component: AboutView,
    meta: { requiresAuth: true },
  },
  {
    path: '/repositories',
    name: 'repositories',    component: ListRepositories,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/', 
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticating, user } = useAuth()
  // Not logged into a guarded route?
  if ( isAuthenticating.value === false && to.meta.requiresAuth === true && !user?.value ) {
    console.log('requires auth, redirect to login');

    next({ name: 'login' })
  }
  else next()
})
export default router
