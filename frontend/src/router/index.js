import Vue from "vue";
import VueRouter from "vue-router";
import Base from "@/views/Layout/Base.vue";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    component: Base,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "/categories",
        name: "Categories",
        component: () => import("@/views/Categories.vue"),
      },
      {
        path: "/logs",
        name: "Logs",
        component: () => import("@/views/Logs.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.Base,
  routes,
});

export default router;
