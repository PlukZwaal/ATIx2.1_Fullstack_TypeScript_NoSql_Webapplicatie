<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-slate-800 mb-2">Account aanmaken</h2>
          <p class="text-slate-600">Maak een account om aan de slag te gaan</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
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

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-red-400 to-rose-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-500 hover:to-rose-600 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Account aanmaken
          </button>


        </form>

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
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const { error: showError } = useToast();

const name = ref('');
const email = ref('');
const password = ref('');

/**
 * Valideert een wachtwoord volgens de beveiligingsvereisten
 * @param {string} pwd - Het wachtwoord om te valideren
 * @returns {string | null} Null als wachtwoord geldig is, anders foutmelding
 */
const validatePassword = (pwd: string) => {
  if (pwd.length < 8) return 'Wachtwoord moet minimaal 8 karakters bevatten';
  if (!/[a-z]/.test(pwd)) return 'Wachtwoord moet een kleine letter bevatten';
  if (!/[A-Z]/.test(pwd)) return 'Wachtwoord moet een hoofdletter bevatten';
  if (!/\d/.test(pwd)) return 'Wachtwoord moet een cijfer bevatten';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Wachtwoord moet een speciaal teken bevatten';
  return null;
};

/**
 * Valideert het registratie formulier
 * Controleert email formaat, naam lengte en wachtwoord sterkte
 * @returns {boolean} True als formulier geldig is, false anders
 */
const validateForm = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showError('Voer een geldig e-mailadres in');
    return false;
  }
  if (name.value.trim().length < 2) {
    showError('Naam moet minimaal 2 karakters bevatten');
    return false;
  }
  
  // Wachtwoord validatie via toast meldingen
  const passwordError = validatePassword(password.value);
  if (passwordError) {
    showError(passwordError);
    return false;
  }
  
  return true;
};

/**
 * Handelt de registratie submit af
 * Valideert formulier, probeert account aan te maken en navigeert naar home pagina bij succes
 * Toont foutmeldingen bij validatie of registratie fouten
 */
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
    showError(backendMsg || 'Registratie mislukt. Probeer het opnieuw.');
  }
};
</script>

<style scoped>
</style>