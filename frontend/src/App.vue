<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import ToastContainer from './components/ToastContainer.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex flex-col">
    <Navbar v-if="authStore.isAuthenticated" />
    <main :class="authStore.isAuthenticated ? 'flex-1' : 'flex-1'">
      <router-view />
    </main>
    <ToastContainer />
  </div>
</template>