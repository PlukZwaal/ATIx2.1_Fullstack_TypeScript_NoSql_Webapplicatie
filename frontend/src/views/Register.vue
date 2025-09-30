<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow w-full max-w-sm">
      <h2 class="text-xl mb-4">Registreren</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-1">Naam</label>
          <input type="text" v-model="name" required class="w-full border p-2 rounded" />
        </div>

        <div>
          <label class="block mb-1">Email</label>
          <input type="email" v-model="email" required class="w-full border p-2 rounded" />
        </div>

        <div>
          <label class="block mb-1">Wachtwoord</label>
          <input type="password" v-model="password" required class="w-full border p-2 rounded" />
        </div>

        <div>
          <button type="submit" class="w-full bg-gray-900 text-white p-2 rounded">Registreren</button>
        </div>
        
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </form>

      <div class="mt-4 text-center">
        <span>Al een account?</span>
        <router-link to="/login" class="text-gray-900 ml-1">Login hier</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err) {
    error.value = 'Registration failed. Please try again.';
  }
};
</script>

<style scoped>
</style>