<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center h-16">
        <!-- Logo + links -->
        <div class="flex items-center gap-8">
          <router-link to="/" class="font-bold text-lg text-gray-900 hover:text-gray-700 transition-colors">
            Avans Modules
          </router-link>
          
          <!-- Navigation links -->
          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-4">
            <router-link 
              to="/modules" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Modules
            </router-link>
            <router-link 
              to="/modules/create" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Nieuwe Module
            </router-link>
          </div>
        </div>

        <!-- User info + logout -->
        <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-4">
          <span class="text-gray-600">{{ authStore.user?.name }}</span>
          <button 
            @click="handleLogout" 
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Uitloggen
          </button>
        </div>

        <!-- Mobile menu button -->
        <button
          v-if="authStore.isAuthenticated"
          @click="menuOpen = !menuOpen"
          class="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Menu"
        >
          <span v-if="!menuOpen">☰</span>
          <span v-else>✕</span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="authStore.isAuthenticated && menuOpen"
        class="md:hidden border-t border-gray-200 py-4 space-y-2"
      >
        <router-link 
          @click="closeMenu" 
          to="/modules" 
          class="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Modules
        </router-link>
        <router-link 
          @click="closeMenu" 
          to="/modules/create" 
          class="block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Nieuwe Module
        </router-link>
        
        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="flex items-center justify-between px-4 py-2">
            <span class="text-gray-600">{{ authStore.user?.name }}</span>
            <button 
              @click="handleLogoutAndClose" 
              class="text-gray-600 hover:text-gray-900 transition-colors"
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

