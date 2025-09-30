<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <!-- Root container: één keer fullscreen; auth pagina's krijgen geen extra padding om scroll te voorkomen -->
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar v-if="authStore.isAuthenticated" />
    <main :class="authStore.isAuthenticated ? 'p-4 flex-1' : 'p-0 flex-1'">
      <!-- Voor niet ingelogde gebruiker (login/register) centreren we binnen de view component zelf -->
      <router-view />
    </main>
  </div>
</template>