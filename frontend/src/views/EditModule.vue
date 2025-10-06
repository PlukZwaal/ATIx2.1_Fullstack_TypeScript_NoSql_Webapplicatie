<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const error = ref('');
const success = ref('');
const loading = ref(true);
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

const loadModule = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/modules/${route.params.id}`);
    const module = response.data;
    
    // Vul formulier met bestaande data
    formData.name = module.name;
    formData.shortdescription = module.shortdescription;
    formData.description = module.description;
    formData.content = module.content;
    formData.studycredit = module.studycredit;
    formData.location = module.location;
    formData.level = module.level;
    formData.learningoutcomes = [...module.learningoutcomes];
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Fout bij laden module';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

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
    
    await axios.put(`/api/modules/${route.params.id}`, cleanedData);
    
    success.value = 'Module succesvol bijgewerkt!';
    
    // Wacht 1 seconde voor feedback en ga dan naar detail pagina
    setTimeout(() => {
      router.push(`/modules/${route.params.id}?updated=true`);
    }, 1000);
    
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Module bijwerken mislukt. Probeer het opnieuw.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadModule();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="container mx-auto px-6 max-w-4xl">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Module wordt geladen...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error && !formData.name" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded p-4 inline-block">
          <h2 class="text-red-800 font-semibold mb-2">Er is iets misgegaan</h2>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <router-link 
            to="/modules" 
            class="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors"
          >
            Terug naar modules
          </router-link>
        </div>
      </div>

      <!-- Form content -->
      <div v-else>
        <!-- Header -->
        <div class="border-b border-gray-200 pb-4 mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Module Bewerken</h1>
          <p class="text-gray-600 mt-2">Pas de module informatie aan</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basis informatie sectie -->
          <div class="bg-white border border-gray-200 rounded p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Basis Informatie</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Naam *</label>
                <input type="text" v-model="formData.name" required class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded" placeholder="Naam van de module" />
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Locatie *</label>
                <input type="text" v-model="formData.location" required class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded" placeholder="Waar wordt de module gegeven?" />
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Studiecredits *</label>
                <input type="number" v-model.number="formData.studycredit" required min="0" class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded" placeholder="Aantal credits" />
              </div>

              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Niveau *</label>
                <input type="text" v-model="formData.level" required class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded" placeholder="Bijv. Beginnend, Gevorderd, Expert" />
              </div>

              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-medium text-gray-700">Korte Beschrijving *</label>
                <input type="text" v-model="formData.shortdescription" required class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded" maxlength="150" placeholder="Korte samenvatting van de module" />
                <small class="text-gray-500 mt-1 block">Max 150 karakters</small>
              </div>

              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-medium text-gray-700">Uitgebreide Beschrijving *</label>
                <textarea v-model="formData.description" required class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded h-24 resize-none" placeholder="Gedetailleerde beschrijving van de module"></textarea>
              </div>

              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-medium text-gray-700">Module Inhoud *</label>
                <textarea v-model="formData.content" required class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded h-32 resize-none" placeholder="Wat wordt er behandeld in deze module?"></textarea>
              </div>
            </div>
          </div>

          <!-- Leeruitkomsten sectie -->
          <div class="bg-white border border-gray-200 rounded p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Leeruitkomsten</h3>

            <div class="space-y-3">
              <div v-for="(_, index) in formData.learningoutcomes" :key="index" class="flex gap-3 items-center">
                <div class="flex-1">
                  <input type="text" v-model="formData.learningoutcomes[index]" class="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 rounded" :placeholder="`Leeruitkomst ${index + 1}`" />
                </div>
                <button type="button" @click="removeLearningOutcome(index)" v-if="formData.learningoutcomes.length > 1" class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex-shrink-0">
                  ×
                </button>
              </div>
              <button type="button" @click="addLearningOutcome" class="w-full py-2 border border-dashed border-gray-300 text-gray-600 rounded hover:border-blue-500 hover:text-blue-600 transition-colors">
                + Leeruitkomst toevoegen
              </button>
            </div>
          </div>

          <!-- Submit knoppen -->
          <div class="flex gap-4 justify-center pt-6">
            <button type="submit" :disabled="isSubmitting" class="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
              <span v-if="isSubmitting">Bezig met bijwerken...</span>
              <span v-else>Module Bijwerken</span>
            </button>
            <router-link 
              :to="`/modules/${route.params.id}`"
              class="bg-gray-100 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
            >
              Annuleren
            </router-link>
          </div>
        
          <!-- Feedback berichten -->
          <div v-if="error || success" class="mt-6">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>
            <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {{ success }}
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>