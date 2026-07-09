import { createRouter, createWebHashHistory } from 'vue-router'  // ← MUDE AQUI
import TerminalView from '../views/TerminalView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', name: 'Terminal', component: TerminalView },
  { path: '/admin-secreto-123', name: 'Admin', component: AdminView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // ← USE HASH
  routes
})

export default router