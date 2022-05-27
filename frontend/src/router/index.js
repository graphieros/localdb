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
        redirect: "/dashboard",
      },
      {
        path: "/categories",
        name: "Categories",
        component: () => import("@/views/Categories.vue"),
      },
      {
        path: "/components",
        name: "Components",
        component: () => import("@/views/Components.vue"),
      },
      {
        path: "/logs",
        name: "Logs",
        component: () => import("@/views/Logs.vue"),
      },
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/Settings.vue"),
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
