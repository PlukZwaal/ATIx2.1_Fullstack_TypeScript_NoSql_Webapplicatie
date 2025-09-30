import { createRouter, createWebHistory } from 'vue-router'

// Route definitie met lazy-loading voor componenten
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// Route beveiliging
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  // Check voor beveiligde routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }
  // Check voor guest-only routes (login/register)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  }
  else {
    next();
  }
});

export default router