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
  <div class="p-6">
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

    <div v-if="loading" class="text-center py-4">
      Laden...
    </div>

    <div v-else-if="error" class="text-red-500 py-4">
      {{ error }}
    </div>

    <div v-else-if="modules.length === 0" class="text-gray-500 py-4">
      Nog geen modules. Klik op "Nieuwe Module" om er een aan te maken.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="module in modules" :key="module.id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div class="p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-gray-900">{{ module.name }}</h3>
            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ module.level }}
            </span>
          </div>
          
          <p class="text-gray-600 text-sm mb-3">{{ module.shortdescription }}</p>
          
          <div class="space-y-2 text-sm text-gray-500">
            <div class="flex justify-between">
              <span>{{ module.location }}</span>
              <span>{{ module.studycredit }} credits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>