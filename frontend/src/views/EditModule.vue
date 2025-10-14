<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getModuleById, updateModule } from '../services/api';
import { useToast } from '../composables/useToast';
import type { CreateModuleData } from '../types';

const router = useRouter();
const route = useRoute();
const { success: showSuccess, error: showError } = useToast();
const loading = ref(true);
const isSubmitting = ref(false);

const formData = reactive<CreateModuleData>({
  name: '',
  shortdescription: '',
  description: '',
  content: '',
  studycredit: 0,
  location: '',
  level: '',
  learningoutcomes: ''
});

/**
 * Laadt een bestaande module voor bewerking
 * Haalt module data op van de server en vult het formulier
 */
const loadModule = async () => {
  try {
    loading.value = true;
    const module = await getModuleById(route.params.id as string);
    
    // Vul formulier met bestaande data
    formData.name = module.name;
    formData.shortdescription = module.shortdescription;
    formData.description = module.description;
    formData.content = module.content;
    formData.studycredit = module.studycredit;
    formData.location = module.location;
    formData.level = module.level;
    formData.learningoutcomes = module.learningoutcomes;
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij laden module');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Deze functies zijn niet meer nodig omdat we nu een string gebruiken

/**
 * Valideert het module bewerkingsformulier
 * Controleert alle verplichte velden en datatypes
 * @returns {string | null} Null als formulier geldig is, anders foutmelding
 */
const validateForm = (): string | null => {
  if (!formData.name.trim()) return 'Naam is verplicht';
  if (!formData.shortdescription.trim()) return 'Korte beschrijving is verplicht';
  if (!formData.description.trim()) return 'Beschrijving is verplicht';
  if (!formData.content.trim()) return 'Inhoud is verplicht';
  if (!formData.location.trim()) return 'Locatie is verplicht';
  if (!formData.level) return 'Niveau is verplicht';
  if (formData.studycredit < 0) return 'Studiecredits moeten 0 of hoger zijn';
  if (!formData.learningoutcomes.trim()) return 'Leeruitkomsten zijn verplicht';
  
  return null;
};

/**
 * Handelt de module update submit af
 * Valideert formulier, werkt module bij en navigeert naar modules overzicht bij succes
 * Toont foutmeldingen bij validatie of update fouten
 */
const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    
    const validationError = validateForm();
    if (validationError) {
      showError(validationError);
      return;
    }
    
    // Gebruik de formData direct, geen filtering nodig voor string
    const cleanedData = {
      ...formData
    };
    
    await updateModule(route.params.id as string, cleanedData);
    
    showSuccess('Module succesvol bijgewerkt!');
    
    // Wacht 1 seconde voor feedback en ga dan naar modules overzicht
    setTimeout(() => {
      router.push('/modules');
    }, 1000);
    
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Module bijwerken mislukt. Probeer het opnieuw.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadModule();
});
</script>

<template>
  <div class="min-h-screen py-8 px-6">
    <div class="container mx-auto max-w-4xl">
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p class="text-slate-600 text-xl">Module wordt geladen...</p>
      </div>

      <div v-else-if="formData.name">
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-r from-red-400 to-rose-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-slate-800">Module Bewerken</h1>
              <p class="text-slate-600">Pas de module informatie aan</p>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="space-y-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-slate-800">Basis Informatie</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Naam *</label>
                  <input 
                    type="text" 
                    v-model="formData.name" 
                    required 
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400"
                    placeholder="Naam van de module"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Locatie *</label>
                  <input 
                    type="text" 
                    v-model="formData.location" 
                    required 
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400"
                    placeholder="Waar wordt de module gegeven?"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Studiecredits *</label>
                  <input 
                    type="number" 
                    v-model.number="formData.studycredit" 
                    required 
                    min="0"
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400"
                    placeholder="Aantal credits"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Niveau *</label>
                  <input 
                    type="text" 
                    v-model="formData.level" 
                    required 
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400"
                    placeholder="Schrijf hier over het niveau..."
                  />
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Korte Beschrijving *</label>
                  <input 
                    type="text" 
                    v-model="formData.shortdescription" 
                    required 
                    maxlength="150"
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400"
                    placeholder="Korte samenvatting van de module"
                  />
                  <p class="text-slate-500 text-sm">Max 150 karakters</p>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Uitgebreide Beschrijving *</label>
                  <textarea 
                    v-model="formData.description" 
                    required 
                    rows="4"
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400 resize-none"
                    placeholder="Gedetailleerde beschrijving van de module"
                  ></textarea>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-slate-700">Module Inhoud *</label>
                  <textarea 
                    v-model="formData.content" 
                    required 
                    rows="5"
                    class="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400 resize-none"
                    placeholder="Wat wordt er behandeld in deze module?"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-slate-800">Leeruitkomsten</h3>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Leeruitkomsten *</label>
                <textarea 
                  v-model="formData.learningoutcomes" 
                  required 
                  rows="6"
                  class="w-full border border-slate-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-20 px-4 py-3 rounded-xl transition-all duration-200 placeholder-slate-400 resize-none"
                  placeholder="Schrijf hier over de leeruitkomsten..."
                ></textarea>
                <p class="text-slate-500 text-sm">
                  Beschrijf hier wat studenten zullen leren en kunnen na afloop van deze module.
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="flex-1 bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-if="isSubmitting">Bezig met bijwerken...</span>
                <span v-else">Module Bijwerken</span>
              </button>
              <router-link 
                :to="`/modules/${route.params.id}`"
                class="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:scale-105 text-center flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuleren
              </router-link>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>