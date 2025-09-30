<template>
  <nav class="bg-white p-4 shadow">
    <div class="flex justify-between items-center">
      <div class="flex gap-4">
        <router-link to="/" class="font-bold">MyApp</router-link>
        <div v-if="authStore.isAuthenticated" class="flex gap-4">
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
        </div>
      </div>
      <div v-if="authStore.isAuthenticated" class="flex gap-4 items-center">
        <span>Welkom, {{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="bg-gray-200 px-3 py-1 rounded">Uitloggen</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>