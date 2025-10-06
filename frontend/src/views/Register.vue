<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-400 to-rose-500 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">Account aanmaken</h2>
          <p class="text-slate-600">Maak een account om aan de slag te gaan</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Naam</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="name" 
                required 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Jouw volledige naam"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div class="relative">
              <input 
                type="email" 
                v-model="email" 
                required 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="je@email.com"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">Wachtwoord</label>
            <div class="relative">
              <input 
                type="password" 
                v-model="password" 
                required 
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="••••••••"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Wachtwoord eisen -->
          <div class="bg-slate-50 rounded-xl p-4 space-y-2">
            <h4 class="text-sm font-medium text-slate-700 mb-3">Wachtwoord vereisten:</h4>
            <div class="grid grid-cols-1 gap-2 text-sm">
              <div class="flex items-center gap-2">
                <div :class="passwordCriteria.length ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-500'" class="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  <svg v-if="passwordCriteria.length" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>•</span>
                </div>
                <span :class="passwordCriteria.length ? 'text-red-600' : 'text-slate-600'">Minimaal 8 karakters</span>
              </div>
              <div class="flex items-center gap-2">
                <div :class="passwordCriteria.lower ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-500'" class="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  <svg v-if="passwordCriteria.lower" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>•</span>
                </div>
                <span :class="passwordCriteria.lower ? 'text-red-600' : 'text-slate-600'">Kleine letter (a-z)</span>
              </div>
              <div class="flex items-center gap-2">
                <div :class="passwordCriteria.upper ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-500'" class="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  <svg v-if="passwordCriteria.upper" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>•</span>
                </div>
                <span :class="passwordCriteria.upper ? 'text-red-600' : 'text-slate-600'">Hoofdletter (A-Z)</span>
              </div>
              <div class="flex items-center gap-2">
                <div :class="passwordCriteria.digit ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-500'" class="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  <svg v-if="passwordCriteria.digit" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>•</span>
                </div>
                <span :class="passwordCriteria.digit ? 'text-red-600' : 'text-slate-600'">Cijfer (0-9)</span>
              </div>
              <div class="flex items-center gap-2">
                <div :class="passwordCriteria.special ? 'bg-red-400 text-white' : 'bg-slate-200 text-slate-500'" class="w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  <svg v-if="passwordCriteria.special" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>•</span>
                </div>
                <span :class="passwordCriteria.special ? 'text-red-600' : 'text-slate-600'">Speciaal teken (!@#?*)</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-red-400 to-rose-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-500 hover:to-rose-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Account aanmaken
          </button>
          
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {{ error }}
          </div>
        </form>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-slate-600">
            Al een account?
            <router-link 
              to="/login" 
              class="text-red-500 hover:text-red-600 font-semibold ml-1 transition-colors duration-200"
            >
              Login hier
            </router-link>
          </p>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="absolute top-10 right-10 w-20 h-20 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 right-20 w-20 h-20 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>

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