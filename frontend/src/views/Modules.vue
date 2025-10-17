<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getModules, deleteModule as apiDeleteModule, toggleFavorite, getFavorites } from '../services/api';
import { useToast } from '../composables/useToast';
import type { Module } from '../types';

const router = useRouter();
const { success: showSuccess, error: showError } = useToast();

// State variabelen
const modules = ref<Module[]>([]); // Alle modules uit database
const loading = ref(true); // True zolang modules worden opgehaald
const favorites = ref<string[]>([]); // IDs van favoriete modules
const searchQuery = ref(''); // Wat de gebruiker in de zoekbalk typt

// Menu state voor actiemenu's per module
const showMenus = ref<{[key: string]: boolean}>({});

/**
 * Gefilterde modules op basis van zoekterm
 * Wordt automatisch herberekend als searchQuery of modules verandert
 */
const filteredModules = computed(() => {
  if (!searchQuery.value.trim()) {
    // Geen zoekterm: toon alles
    return modules.value;
  }
  // Filter modules op naam (hoofdletterongevoelig)
  const search = searchQuery.value.toLowerCase();
  return modules.value.filter(module => 
    module.name.toLowerCase().includes(search)
  );
});

/**
 * Haal alle modules op van de server (1x bij laden pagina)
 */
const loadModules = async () => {
  try {
    loading.value = true;
    modules.value = await getModules();
  } catch (err) {
    showError('Fout bij laden modules');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

/**
 * Haal favorieten op van de ingelogde gebruiker
 */
const loadUserFavorites = async () => {
  try {
    const data = await getFavorites();
    favorites.value = data.favorites || [];
  } catch (err) {
    console.error('Fout bij laden favorieten:', err);
  }
};

/**
 * Voeg module toe aan of verwijder uit favorieten
 * @param moduleId ID van de module
 * @param event Click event om propagatie te stoppen
 */
const handleToggleFavorite = async (moduleId: string, event: Event) => {
  event.stopPropagation();
  try {
    const data = await toggleFavorite(moduleId);
    favorites.value = data.favorites;
    if (data.isFavorite) {
      showSuccess('Toegevoegd aan favorieten!');
    } else {
      showSuccess('Module verwijderd uit favorieten');
    }
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij bijwerken favoriet');
  }
};

/**
 * Check of een module favoriet is
 * @param moduleId ID van de module
 * @returns true als favoriet
 */
const isFavorite = (moduleId: string) => favorites.value.includes(moduleId);

onMounted(async () => {
  // Laad modules en favorieten bij het openen van de pagina
  await loadModules();
  await loadUserFavorites();
  
  // Check of er een "created" melding moet worden getoond
  if (router.currentRoute.value.query.created === 'true') {
    router.replace({ path: '/modules' });
  }
  
  // Check of er een "deleted" melding moet worden getoond
  if (router.currentRoute.value.query.deleted === 'true') {
    showSuccess('Module succesvol verwijderd!');
    router.replace({ path: '/modules' });
  }
  
  // Sluit menu's als je ergens anders klikt
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      Object.keys(showMenus.value).forEach(key => {
        showMenus.value[key] = false;
      });
    }
  };
  
  document.addEventListener('click', handleClickOutside);
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});

// Navigeer naar de pagina om een nieuwe module aan te maken
const goToCreate = () => router.push('/modules/create');

/**
 * Navigeer naar de detailpagina van een module
 */
const viewModule = (moduleId: string) => router.push(`/modules/${moduleId}`);

/**
 * Open of sluit het actiemenu voor een module
 */
const toggleMenu = (moduleId: string, event: Event) => {
  event.stopPropagation();
  showMenus.value[moduleId] = !showMenus.value[moduleId];
  // Sluit alle andere menu's
  Object.keys(showMenus.value).forEach(key => {
    if (key !== moduleId) showMenus.value[key] = false;
  });
};

/**
 * Navigeer naar de bewerkpagina van een module
 */
const editModule = (moduleId: string, event: Event) => {
  event.stopPropagation();
  showMenus.value[moduleId] = false;
  router.push(`/modules/edit/${moduleId}`);
};

/**
 * Verwijder een module na bevestiging
 */
const deleteModule = async (moduleId: string, event: Event) => {
  event.stopPropagation();
  showMenus.value[moduleId] = false;
  if (!confirm('Weet je zeker dat je deze module wilt verwijderen?')) return;
  try {
    await apiDeleteModule(moduleId);
    loadModules();
    showSuccess('Module succesvol verwijderd!');
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij verwijderen module');
  }
};

</script>

<template>
  <div class="min-h-screen py-8 px-6">
    <div class="container mx-auto max-w-7xl">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-4xl font-bold text-slate-800 mb-2">Modules</h1>
          <p class="text-slate-600">Ontdek en beheer alle beschikbare modules</p>
        </div>
        <button 
          @click="goToCreate"
          class="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nieuwe Module
        </button>
      </div>

      <!-- ZOEKBALK -->
      <div class="mb-6 max-w-2xl">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Zoek modules op naam..."
            class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm bg-white shadow-sm"
          />
        </div>
        <!-- Toon aantal resultaten als er gezocht wordt -->
        <p v-if="searchQuery.trim()" class="text-sm text-slate-500 mt-2">
          {{ filteredModules.length }} {{ filteredModules.length === 1 ? 'module' : 'modules' }} gevonden
        </p>
      </div>

      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-slate-600 text-lg">Modules laden...</p>
      </div>

      <div v-else-if="filteredModules.length === 0" class="text-center py-16">
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-12 inline-block">
          <h3 class="text-xl font-semibold text-slate-700">
            {{ searchQuery.trim() ? 'Geen modules gevonden met deze zoekterm' : 'Geen modules gevonden' }}
          </h3>
        </div>
      </div>

      <div v-else class="space-y-6">
          <div 
            v-for="module in filteredModules" 
            :key="module.id" 
            @click="viewModule(module.id)"
            class="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-red-50/0 to-rose-50/0 group-hover:from-red-50/50 group-hover:to-rose-50/50 transition-all duration-300 rounded-2xl"></div>
            
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1 pr-4">
                  <h3 class="text-xl font-bold text-slate-800 group-hover:text-red-500 transition-colors duration-200 mb-2">{{ module.name }}</h3>
                  <p class="text-slate-600 leading-relaxed">{{ module.shortdescription }}</p>
                </div>
                
                <div class="flex items-center gap-3">
                  <button 
                    @click="handleToggleFavorite(module.id, $event)"
                    class="p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
                    :title="isFavorite(module.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-6 w-6 transition-all duration-200"
                      :class="isFavorite(module.id) ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-400'"
                      :fill="isFavorite(module.id) ? 'currentColor' : 'none'"
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  <div class="relative">
                    <button 
                      @click="toggleMenu(module.id, $event)"
                      class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
                      title="Meer opties"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    
                    <div v-if="showMenus[module.id]" class="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-40 overflow-hidden">
                      <button 
                        @click="editModule(module.id, $event)"
                        class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Bewerken
                      </button>
                      <div class="border-t border-slate-100"></div>
                      <button 
                        @click="deleteModule(module.id, $event)"
                        class="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Verwijderen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ module.location }}
                </span>
                <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  {{ module.studycredit }} ECTS
                </span>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {{ module.level }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
</style>