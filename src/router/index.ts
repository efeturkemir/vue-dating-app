import {  onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebase.js';
import { createRouter, createWebHistory } from "vue-router";

const getCurrentUser = () =>{
  return new Promise((resolve, reject) =>{
    const removeListener = onAuthStateChanged(
      auth,
      (user) =>{
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/cropper",
      name: "cropper",
      component: () => import("../views/Crop.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
      meta: {
        requiresAuth: true,
      },

    },

    {
      path: "/edit",
      name: "Edit",
      component: () => import("../views/EditProfile.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/chat",
      name: "Chat",
      component: () => import("../views/Chat.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/chatrooms/:chatId",
      name: "ChatRoom",
      component: () => import("../views/ChatRoom.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register.vue"),
    },

  ],
});
router.beforeEach(async (to, from, next) => {
  
  


  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    if (!await getCurrentUser()) {
      // no token, redirect to login page
      next({ name: 'Login' })
    } else {
      // token exists, allow access to the route
     next()
    }
  } else {
    // this route does not require auth, allow access to all
    next()
  }
})

export default router;
