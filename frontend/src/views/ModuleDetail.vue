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
  learningoutcomes: string;
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
  <div class="min-h-screen py-8 px-6">
    <div class="container mx-auto max-w-5xl">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-slate-600 text-xl">Module wordt geladen...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-12 inline-block">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-700 mb-4">Er is een fout opgetreden</h3>
          <p class="text-red-600 mb-6">{{ error }}</p>
          <button @click="goBack" class="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105">
            Terug naar modules
          </button>
        </div>
      </div>

      <!-- Module content -->
      <div v-else-if="module" class="space-y-8">
        <!-- Header -->
        <div class="relative">
          <!-- Back button -->
          <button 
            @click="goBack"
            class="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Terug naar modules
          </button>

          <!-- Module header -->
          <div class="bg-gradient-to-r from-red-400 to-rose-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <!-- Background decoration -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div class="relative z-10">
              <h1 class="text-4xl font-bold mb-4">{{ module.name }}</h1>
              <p class="text-blue-100 text-lg mb-6 max-w-3xl">{{ module.shortdescription }}</p>
              
              <!-- Quick stats -->
              <div class="flex flex-wrap gap-4">
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium">{{ module.location }}</span>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span class="font-medium">{{ module.studycredit }} credits</span>
                </div>
                <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="font-medium">{{ module.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Beschrijving -->
            <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Beschrijving</h2>
              </div>
              <p class="text-slate-700 leading-relaxed text-lg">{{ module?.description }}</p>
            </div>

            <!-- Inhoud -->
            <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Module Inhoud</h2>
              </div>
              <div class="text-slate-700 leading-relaxed text-lg whitespace-pre-line">{{ module?.content }}</div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Leeruitkomsten -->
            <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 sticky top-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-slate-800">Leeruitkomsten</h2>
              </div>
              <div class="bg-slate-50 rounded-xl p-6">
                <div class="text-slate-700 leading-relaxed whitespace-pre-line">{{ module?.learningoutcomes }}</div>
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