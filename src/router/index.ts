import { createRouter, createWebHistory } from "vue-router";
import TerminalView from "../views/TerminalView.vue";
import AdminView from "../views/AdminView.vue";

// 1. Define the routes array correctly (Not a router instance)
const routes = [
  {
    path: "/",
    name: "Terminal",
    component: TerminalView,
  },
  {
    path: "/host_terminal1306",
    name: "Admin",
    component: AdminView,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

// 2. Initialize the router instance once
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // Passing the array here works perfectly now
});

// 3. Keep your protection navigation guard
router.beforeEach((to, from, next) => {
  if (to.path === "/admin" || to.path === "/admin/") {
    next("/");
  } else {
    next();
  }
});

export default router;
