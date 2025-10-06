<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
const route = useRoute();
const module = ref<Module | null>(null);
const loading = ref(true);
const error = ref('');

const loadModule = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/api/modules/${route.params.id}`);
    module.value = response.data;
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Fout bij laden module';
    console.error(err);
  } finally {
    loading.value = false;
  }
};



const goBack = () => {
  router.push('/modules');
};

onMounted(() => {
  loadModule();
  
  // Check voor update melding
  if (router.currentRoute.value.query.updated === 'true') {
    // Toon een tijdelijke success message
    const successEl = document.createElement('div');
    successEl.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
    successEl.textContent = 'Module succesvol bijgewerkt!';
    document.body.appendChild(successEl);
    
    // Verwijder melding na 3 seconden
    setTimeout(() => {
      document.body.removeChild(successEl);
    }, 3000);
    
    // Clean URL
    router.replace({ path: `/modules/${route.params.id}` });
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div class="container mx-auto px-6 max-w-4xl">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-gray-600">Module wordt geladen...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded p-4 inline-block">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="goBack" class="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors">
            Terug naar modules
          </button>
        </div>
      </div>

      <!-- Module content -->
      <div v-else-if="module">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ module.name }}</h1>
          <p class="text-gray-600">{{ module.shortdescription }}</p>
        </div>

        <!-- Module details -->
        <div class="bg-white border border-gray-200 rounded p-4 mb-6">
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <span><strong>Locatie:</strong> {{ module.location }}</span>
            <span><strong>Credits:</strong> {{ module.studycredit }}</span>
            <span><strong>Niveau:</strong> {{ module.level }}</span>
          </div>
        </div>

        <!-- Content sections -->
        <div class="space-y-6">
          <!-- Beschrijving -->
          <div class="bg-white border border-gray-200 rounded p-4">
            <h2 class="text-xl font-bold text-gray-900 mb-3">Beschrijving</h2>
            <p class="text-gray-700">{{ module?.description }}</p>
          </div>

          <!-- Inhoud -->
          <div class="bg-white border border-gray-200 rounded p-4">
            <h2 class="text-xl font-bold text-gray-900 mb-3">Inhoud</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ module?.content }}</p>
          </div>

          <!-- Leeruitkomsten -->
          <div class="bg-white border border-gray-200 rounded p-4">
            <h2 class="text-xl font-bold text-gray-900 mb-3">Leeruitkomsten</h2>
            <ul class="space-y-2">
              <li v-for="(outcome, index) in module?.learningoutcomes" :key="index" class="flex items-start gap-3">
                <span class="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">{{ index + 1 }}</span>
                <span class="text-gray-700">{{ outcome }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Navigation footer -->
        <div class="text-center mt-8">
          <button 
            @click="goBack"
            class="bg-gray-600 text-white px-6 py-2 rounded font-medium hover:bg-gray-700 transition-colors"
          >
            Terug naar modules
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>