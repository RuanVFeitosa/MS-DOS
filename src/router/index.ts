import { createRouter, createWebHistory } from 'vue-router'
import TerminalView from '../views/TerminalView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  {
    path: '/',
    name: 'Terminal',
    component: TerminalView
  },
  {
    path: '/host_terminal1306',
    name: 'Admin',
    component: AdminView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Proteção: redireciona /admin para a página inicial
router.beforeEach((to, from, next) => {
  if (to.path === '/admin' || to.path === '/admin/') {
    next('/')
  } else {
    next()
  }
})

export default router