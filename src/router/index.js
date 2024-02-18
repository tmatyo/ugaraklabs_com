import { createRouter, createWebHistory, RouterView } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Tr from "../i18n/translation";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/:lang?",
      component: RouterView,
      beforeEnter: Tr.routerMiddleware,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "about",
          name: "about",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/AboutView.vue"),
        },
      ],
    },
  ],
});

export default router;
