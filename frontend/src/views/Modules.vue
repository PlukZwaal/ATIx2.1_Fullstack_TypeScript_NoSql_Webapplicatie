<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

interface Module {
  id: string;
  name: string;
  shortdescription: string;
  description: string;
  content: string;
  studycredit: number;
  location: string;
  level: string;
  learningoutcomes: string[];
}

const router = useRouter();
const modules = ref<Module[]>([]);
const loading = ref(true);
const error = ref('');
const successMessage = ref('');
const loadModules = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/modules');
    modules.value = response.data;
  } catch (err) {
    error.value = 'Fout bij laden modules';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadModules();
  
  // Check voor succesmelding vanuit route state
  if (router.currentRoute.value.query.created === 'true') {
    successMessage.value = 'Module succesvol aangemaakt!';
    // Verwijder de query parameter uit de URL
    router.replace({ path: '/modules' });
    // Verberg de melding na 3 seconden
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  }
});

const goToCreate = () => {
  router.push('/modules/create');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-6 py-8 max-w-7xl">
      <!-- Header met titel en nieuwe module knop -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Modules</h1>
        <button 
          @click="goToCreate"
          class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Nieuwe Module
        </button>
      </div>

      <!-- Succesmelding -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Grid layout: Filter sidebar + Modules -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filter Sidebar (1/4 van de breedte) -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
      </div>

      <!-- Modules Content (3/4 van de breedte) -->
      <div class="lg:col-span-3">
        <div v-if="loading" class="text-center py-8">
          Laden...
        </div>

        <div v-else-if="error" class="text-red-500 py-8">
          {{ error }}
        </div>

        <div v-else-if="modules.length === 0" class="text-gray-500 py-8 text-center">
          <p class="text-lg">Nog geen modules gevonden</p>
          <p class="text-sm mt-2">Klik op "Nieuwe Module" om er een aan te maken.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="module in modules" :key="module.id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <!-- Module naam -->
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ module.name }}</h3>
            
            <!-- Korte beschrijving -->
            <p class="text-gray-600 mb-4">{{ module.shortdescription }}</p>
            
            <!-- Info badges -->
            <div class="flex flex-wrap gap-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ module.location }}
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {{ module.studycredit }} credits
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {{ module.level }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
</style>