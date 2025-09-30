<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="authStore.isAuthenticated" />
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>