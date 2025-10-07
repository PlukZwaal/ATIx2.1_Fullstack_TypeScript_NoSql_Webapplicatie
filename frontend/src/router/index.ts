import { createRouter, createWebHistory } from 'vue-router'
import { STORAGE_KEYS } from '../constants'

// Maak router aan met alle routes
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
      path: '/modules',
      name: 'modules',
      component: () => import('../views/Modules.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/modules/create',
      name: 'modules-create',
      component: () => import('../views/CreateModule.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/modules/:id',
      name: 'module-detail',
      component: () => import('../views/ModuleDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/modules/edit/:id',
      name: 'module-edit',
      component: () => import('../views/EditModule.vue'),
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
  ],
  scrollBehavior() {
    // Scroll altijd naar boven bij navigatie
    return { top: 0 };
  }
})

// Controleer bij elke route of gebruiker toegang heeft
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem(STORAGE_KEYS.TOKEN);

  // Route vereist login maar gebruiker is niet ingelogd
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  }
  // Route is alleen voor niet-ingelogde gebruikers maar gebruiker is ingelogd
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  }
  // Gebruiker heeft toegang
  else {
    next();
  }
});

export default router