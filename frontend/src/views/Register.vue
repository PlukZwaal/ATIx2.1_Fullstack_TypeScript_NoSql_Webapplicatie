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

        <!-- Dynamische wachtwoord eisen -->
        <ul class="text-sm mt-2 space-y-1">
          <li :class="passwordCriteria.length ? 'text-green-600' : 'text-gray-500'">Minimaal 8 karakters</li>
          <li :class="passwordCriteria.lower ? 'text-green-600' : 'text-gray-500'">Bevat een kleine letter (a-z)</li>
          <li :class="passwordCriteria.upper ? 'text-green-600' : 'text-gray-500'">Bevat een hoofdletter (A-Z)</li>
          <li :class="passwordCriteria.digit ? 'text-green-600' : 'text-gray-500'">Bevat een cijfer (0-9)</li>
          <li :class="passwordCriteria.special ? 'text-green-600' : 'text-gray-500'">Bevat een speciaal teken (! @ # ? *)</li>
        </ul>

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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

// Computed: status van individuele criteria voor live feedback
const passwordCriteria = computed(() => ({
  length: password.value.length >= 8,
  lower: /[a-z]/.test(password.value),
  upper: /[A-Z]/.test(password.value),
  digit: /\d/.test(password.value),
  special: /[^A-Za-z0-9]/.test(password.value),
}));

// Validatie regels (blokkeert submit als niet compleet)
const validateForm = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    error.value = 'Voer een geldig e-mailadres in';
    return false;
  }
  if (name.value.trim().length < 2) {
    error.value = 'Naam moet minimaal 2 karakters bevatten';
    return false;
  }
  if (!passwordCriteria.value.length || !passwordCriteria.value.lower || !passwordCriteria.value.upper || !passwordCriteria.value.digit || !passwordCriteria.value.special) {
    error.value = 'Wachtwoord voldoet nog niet aan alle eisen (hoofdletter, kleine letter, cijfer, speciaal teken)';
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  try {
    if (!validateForm()) return;
    
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err: any) {
    // Toon backend foutmelding indien beschikbaar (bv. e-mailadres al in gebruik)
    const backendMsg = err?.response?.data?.message;
    error.value = backendMsg || 'Registratie mislukt. Probeer het opnieuw.';
  }
};
</script>

<style scoped>
</style>