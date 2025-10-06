<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Nieuwe Module Aanmaken</h1>
        <p class="text-gray-600">Vul onderstaande gegevens in om een nieuwe cursusmodule toe te voegen</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Basis informatie sectie -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Basis Informatie
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Naam *</label>
                <input type="text" v-model="formData.name" required class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg transition-colors duration-200" placeholder="Naam van de module" />
              </div>

              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Locatie *</label>
                <input type="text" v-model="formData.location" required class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg transition-colors duration-200" placeholder="Waar wordt de module gegeven?" />
              </div>
            </div>
          </div>

          <!-- Beschrijving sectie -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Beschrijving
            </h3>
            <div class="space-y-6">
              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Korte Beschrijving *</label>
                <input type="text" v-model="formData.shortdescription" required class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg transition-colors duration-200" maxlength="150" placeholder="Korte samenvatting van de module" />
                <small class="text-gray-500 mt-1 block">Max 150 karakters</small>
              </div>

              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Uitgebreide Beschrijving *</label>
                <textarea v-model="formData.description" required class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg h-24 resize-none transition-colors duration-200" placeholder="Gedetailleerde beschrijving van de module"></textarea>
              </div>

              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Module Inhoud *</label>
                <textarea v-model="formData.content" required class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg h-32 resize-none transition-colors duration-200" placeholder="Wat wordt er behandeld in deze module?"></textarea>
              </div>
            </div>
          </div>

          <!-- Details sectie -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Module Details
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Studiecredits *</label>
                <input type="number" v-model.number="formData.studycredit" required min="0" class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg transition-colors duration-200" placeholder="Aantal credits" />
              </div>

              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Niveau *</label>
                <input type="text" v-model="formData.level" required class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg transition-colors duration-200" placeholder="Bijv. Beginnend, Gevorderd, Expert" />
              </div>
            </div>
          </div>

          <!-- Leeruitkomsten sectie -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Leeruitkomsten
            </h3>
            <div class="space-y-3">
              <div v-for="(_, index) in formData.learningoutcomes" :key="index" class="flex gap-3 items-center">
                <div class="flex-1">
                  <input type="text" v-model="formData.learningoutcomes[index]" class="w-full border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-lg transition-colors duration-200" :placeholder="`Leeruitkomst ${index + 1}`" />
                </div>
                <button type="button" @click="removeLearningOutcome(index)" v-if="formData.learningoutcomes.length > 1" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex-shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <button type="button" @click="addLearningOutcome" class="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors duration-200 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Leeruitkomst toevoegen
              </button>
            </div>
          </div>

          <!-- Submit knoppen -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button type="submit" :disabled="isSubmitting" class="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:transform-none">
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bezig met opslaan...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Module Aanmaken
              </span>
            </button>
            <router-link 
              to="/modules" 
              class="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200 shadow-lg text-center flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Annuleren
            </router-link>
          </div>
        
          <!-- Feedback berichten -->
          <div v-if="error || success" class="mt-6">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ error }}
            </div>
            <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ success }}
            </div>
          </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const error = ref('');
const success = ref('');
const isSubmitting = ref(false);

const formData = reactive({
  name: '',
  shortdescription: '',
  description: '',
  content: '',
  studycredit: 0,
  location: '',
  level: '',
  learningoutcomes: ['']
});

const addLearningOutcome = () => {
  formData.learningoutcomes.push('');
};

const removeLearningOutcome = (index: number) => {
  if (formData.learningoutcomes.length > 1) {
    formData.learningoutcomes.splice(index, 1);
  }
};

const validateForm = (): string | null => {
  if (!formData.name.trim()) return 'Naam is verplicht';
  if (!formData.shortdescription.trim()) return 'Korte beschrijving is verplicht';
  if (!formData.description.trim()) return 'Beschrijving is verplicht';
  if (!formData.content.trim()) return 'Inhoud is verplicht';
  if (!formData.location.trim()) return 'Locatie is verplicht';
  if (!formData.level) return 'Niveau is verplicht';
  if (formData.studycredit < 0) return 'Studiecredits moeten 0 of hoger zijn';
  
  const validOutcomes = formData.learningoutcomes.filter(outcome => outcome.trim());
  if (validOutcomes.length === 0) return 'Er moet minimaal één leeruitkomst worden opgegeven';
  
  return null;
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    error.value = '';
    success.value = '';
    
    const validationError = validateForm();
    if (validationError) {
      error.value = validationError;
      return;
    }
    
    // Filter lege leeruitkomsten
    const cleanedData = {
      ...formData,
      learningoutcomes: formData.learningoutcomes.filter(outcome => outcome.trim())
    };
    
    await axios.post('/api/modules', cleanedData);
    
    success.value = 'Module succesvol aangemaakt!';
    
    // Wacht 1 seconde voor feedback en ga dan naar modules pagina
    setTimeout(() => {
      router.push('/modules?created=true');
    }, 1000);
    
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Module aanmaken mislukt. Probeer het opnieuw.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
</style>
