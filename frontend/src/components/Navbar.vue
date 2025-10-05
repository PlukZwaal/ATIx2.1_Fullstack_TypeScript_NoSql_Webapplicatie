<template>
  <nav class="bg-gray-900 text-white px-4 sm:px-6 py-3 shadow">
    <div class="flex justify-between items-center">
      <!-- Desktop: logo + (desktop) links -->
      <div class="flex items-center gap-6">
        <router-link to="/" class="font-bold tracking-wide text-sm sm:text-base">LU1_NoSQL_Typescript</router-link>
        <!-- Desktop navigatie links (alleen ingelogd) -->
        <div v-if="authStore.isAuthenticated" class="hidden md:flex gap-5 text-sm">
          <router-link to="/modules" class="hover:underline">Modules</router-link>
        </div>
      </div>

      <!-- Desktop: user info + logout -->
      <div v-if="authStore.isAuthenticated" class="hidden md:flex gap-4 items-center">
        <span class="text-sm">{{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="bg-white/10 hover:bg-white/20 transition px-3 py-1 rounded text-sm">Uitloggen</button>
      </div>

      <!-- Mobile: hamburger knop (zichtbaar onder md) -->
      <button
        v-if="authStore.isAuthenticated"
        @click="menuOpen = !menuOpen"
        class="md:hidden inline-flex items-center justify-center w-9 h-9 rounded bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Menu"
  :aria-expanded="menuOpen"
      >
        <span v-if="!menuOpen" class="flex flex-col gap-[5px]">
          <span class="block w-5 h-0.5 bg-white"></span>
          <span class="block w-5 h-0.5 bg-white"></span>
          <span class="block w-5 h-0.5 bg-white"></span>
        </span>
        <span v-else class="block w-5 h-5 relative">
          <span class="absolute left-0 top-1/2 -translate-y-1/2 block w-5 h-0.5 bg-white rotate-45"></span>
          <span class="absolute left-0 top-1/2 -translate-y-1/2 block w-5 h-0.5 bg-white -rotate-45"></span>
        </span>
      </button>
    </div>

    <!-- Mobile: uitklapmenu met navigatie + user info -->
    <div
      v-if="authStore.isAuthenticated && menuOpen"
      class="md:hidden mt-3 border-t border-white/10 pt-3 flex flex-col gap-3 text-sm"
    >
      <router-link @click="closeMenu" to="/modules" class="hover:underline">Modules</router-link>
      <div class="flex items-center justify-between">
        <span class="text-xs text-white/80">{{ authStore.user?.name }}</span>
        <button @click="handleLogoutAndClose" class="bg-white/10 hover:bg-white/20 transition px-3 py-1 rounded text-xs">Uitloggen</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

// Toggle logout & redirect (desktop + mobile gedeeld)

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const handleLogoutAndClose = () => {
  handleLogout();
  menuOpen.value = false;
};

const closeMenu = () => { menuOpen.value = false; };
</script>

