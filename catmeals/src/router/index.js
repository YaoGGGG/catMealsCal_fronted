import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Recipe from '@/views/Recipe/index.vue'
import Calculator from '@/views/Calculator/index.vue'
import ProfilePage from '@/views/Profile/ProfilePage.vue'
import Signup from '@/views/Login/signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: 'recipe',
          component: Recipe
        },
        {
          path: '/calculator/:id',
          name: 'RecipeCalculator',
          component: Calculator,
        },
        {
          path: 'dashboard',
          component: ProfilePage
        }
      ]
    },
    // {
    //   path: '/profile', 
    //   component: ProfilePage
    // }
  ]
})

export default router
