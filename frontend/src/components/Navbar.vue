<template>
  <nav class="bg-white/80 backdrop-blur-md border-b border-red-100/60 sticky top-0 z-50 shadow-sm">
    <div class="container mx-auto px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-10">
          <router-link to="/" class="font-bold text-xl text-slate-800 hover:text-red-600 transition-colors">
            <span class="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">Avans</span> Modules
          </router-link>
          
          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-8">
            <router-link to="/modules" class="text-slate-600 hover:text-slate-900 font-medium transition-colors relative group">
              Modules
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full"></span>
            </router-link>
            <router-link to="/modules/create" class="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-rose-600 hover:shadow-lg transition-colors">
              + Nieuwe Module
            </router-link>
          </div>
        </div>

        <!-- User info + logout -->
        <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-4">
          <div class="flex items-center gap-3 bg-red-50 rounded-full px-4 py-2">
            <div class="w-8 h-8 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-slate-700 font-medium">{{ authStore.user?.name }}</span>
          </div>
          <button @click="handleLogout" class="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50" title="Uitloggen">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <button v-if="authStore.isAuthenticated" @click="menuOpen = !menuOpen" class="md:hidden text-slate-600 hover:text-slate-900 transition-colors p-2" aria-label="Menu">
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="authStore.isAuthenticated && menuOpen"
        class="md:hidden border-t border-slate-200 py-4 space-y-2 bg-white/95 backdrop-blur-sm"
      >
        <router-link 
          @click="closeMenu" 
          to="/modules" 
          class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2"
        >
          Modules
        </router-link>
        <router-link 
          @click="closeMenu" 
          to="/modules/create" 
          class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg mx-2"
        >
          Nieuwe Module
        </router-link>
        
        <div class="border-t border-slate-200 pt-4 mt-4 mx-2">
          <div class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-slate-700 font-medium">{{ authStore.user?.name }}</span>
            </div>
            <button 
              @click="handleLogoutAndClose" 
              class="text-red-600 hover:text-red-700 transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
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

