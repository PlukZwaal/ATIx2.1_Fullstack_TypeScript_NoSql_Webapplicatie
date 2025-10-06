<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from '../composables/useToast';

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
const { success: showSuccess, error: showError } = useToast();
const modules = ref<Module[]>([]);
const loading = ref(true);

// Filter state
const filterOptions = ref<{
  locations: {value: string, count: number}[],
  studyCredits: {value: number, count: number}[],
  levels: {value: string, count: number}[]
}>({
  locations: [],
  studyCredits: [],
  levels: []
});

const selectedFilters = ref<{
  locations: string[],
  studyCredits: number[],
  levels: string[]
}>({
  locations: [],
  studyCredits: [],
  levels: []
});

const searchQuery = ref('');
const showMenus = ref<{[key: string]: boolean}>({});
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Configureerbare zoek delay (in milliseconden)
const SEARCH_DELAY = 1000; // Je kunt dit aanpassen naar wat je wilt

// Paginering
const currentPage = ref(1);
const modulesPerPage = 25;
const totalModules = ref(0);
const allModules = ref<Module[]>([]);
const loadFilterOptions = async () => {
  try {
    const response = await axios.get('/api/modules/filter-options');
    filterOptions.value = response.data;
  } catch (err) {
    console.error('Fout bij laden filter opties:', err);
  }
};

const loadModules = async () => {
  try {
    loading.value = true;
    
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add search query if exists
    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim());
    }
    
    if (selectedFilters.value.locations.length > 0) {
      selectedFilters.value.locations.forEach(location => {
        params.append('locations', location);
      });
    }
    
    if (selectedFilters.value.studyCredits.length > 0) {
      selectedFilters.value.studyCredits.forEach(credit => {
        params.append('studyCredits', credit.toString());
      });
    }
    
    if (selectedFilters.value.levels.length > 0) {
      selectedFilters.value.levels.forEach(level => {
        params.append('levels', level);
      });
    }
    
    const queryString = params.toString();
    const url = queryString ? `/api/modules?${queryString}` : '/api/modules';
    
    const response = await axios.get(url);
    allModules.value = response.data;
    totalModules.value = allModules.value.length;
    
    // Reset naar pagina 1 bij nieuwe zoekactie/filter
    currentPage.value = 1;
    updateDisplayedModules();
  } catch (err) {
    showError('Fout bij laden modules');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Update displayed modules based on current page
const updateDisplayedModules = () => {
  const startIndex = (currentPage.value - 1) * modulesPerPage;
  const endIndex = startIndex + modulesPerPage;
  modules.value = allModules.value.slice(startIndex, endIndex);
};

onMounted(async () => {
  // Laad filter opties eerst
  await loadFilterOptions();
  // Dan modules
  await loadModules();
  
  // Clean up query parameters zonder extra meldingen te tonen
  if (router.currentRoute.value.query.created === 'true') {
    // Verwijder de query parameter uit de URL (toast is al getoond in CreateModule)
    router.replace({ path: '/modules' });
  }
  
  // Check voor delete melding
  if (router.currentRoute.value.query.deleted === 'true') {
    showSuccess('Module succesvol verwijderd!');
    // Verwijder de query parameter uit de URL
    router.replace({ path: '/modules' });
  }
  
  // Close menus when clicking outside
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

const goToCreate = () => {
  router.push('/modules/create');
};

const viewModule = (moduleId: string) => {
  router.push(`/modules/${moduleId}`);
};

const toggleMenu = (moduleId: string, event: Event) => {
  event.stopPropagation(); // Voorkom dat de module wordt geopend
  showMenus.value[moduleId] = !showMenus.value[moduleId];
  
  // Sluit alle andere menu's
  Object.keys(showMenus.value).forEach(key => {
    if (key !== moduleId) {
      showMenus.value[key] = false;
    }
  });
};

const editModule = (moduleId: string, event: Event) => {
  event.stopPropagation();
  showMenus.value[moduleId] = false;
  router.push(`/modules/edit/${moduleId}`);
};

const deleteModule = async (moduleId: string, event: Event) => {
  event.stopPropagation();
  showMenus.value[moduleId] = false;
  
  if (!confirm('Weet je zeker dat je deze module wilt verwijderen?')) {
    return;
  }
  
  try {
    await axios.delete(`/api/modules/${moduleId}`);
    // Herlaad modules
    loadModules();
    showSuccess('Module succesvol verwijderd!');
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij verwijderen module');
  }
};

const toggleLocationFilter = (location: string) => {
  const index = selectedFilters.value.locations.indexOf(location);
  if (index > -1) {
    selectedFilters.value.locations.splice(index, 1);
  } else {
    selectedFilters.value.locations.push(location);
  }
  loadModules();
};

const toggleStudyCreditFilter = (studyCredit: number) => {
  const index = selectedFilters.value.studyCredits.indexOf(studyCredit);
  if (index > -1) {
    selectedFilters.value.studyCredits.splice(index, 1);
  } else {
    selectedFilters.value.studyCredits.push(studyCredit);
  }
  loadModules();
};

const toggleLevelFilter = (level: string) => {
  const index = selectedFilters.value.levels.indexOf(level);
  if (index > -1) {
    selectedFilters.value.levels.splice(index, 1);
  } else {
    selectedFilters.value.levels.push(level);
  }
  loadModules();
};

// Debounced search functie
const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    loadModules();
  }, SEARCH_DELAY); // Gebruikt de configureerbare delay
};

// Paginering functies
const totalPages = computed(() => Math.ceil(totalModules.value / modulesPerPage));

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    updateDisplayedModules();
    // Scroll naar bovenkant van pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updateDisplayedModules();
    // Scroll naar bovenkant van pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updateDisplayedModules();
    // Scroll naar bovenkant van pagina
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const clearFilters = () => {
  selectedFilters.value.locations = [];
  selectedFilters.value.studyCredits = [];
  selectedFilters.value.levels = [];
  loadModules();
};
</script>

<template>
  <div class="min-h-screen py-8 px-6">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
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





      <!-- Grid layout: Filter sidebar + Modules -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Filter Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div class="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 class="text-lg font-semibold text-slate-800">Filters</h3>
          </div>

          <!-- Zoekbalk -->
          <div class="mb-6">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Zoek modules..."
                class="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          
          <!-- Locatie filter -->
          <div class="mb-6">
            <h4 class="text-sm font-semibold text-slate-700 mb-3">Locatie</h4>
            <div class="space-y-2">
              <label 
                v-for="location in filterOptions.locations" 
                :key="location.value" 
                class="flex items-center cursor-pointer p-3 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedFilters.locations.includes(location.value)"
                  @change="toggleLocationFilter(location.value)"
                  class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span class="ml-3 text-sm text-slate-700 flex-1 group-hover:text-blue-600">{{ location.value }}</span>
                <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{{ location.count }}</span>
              </label>
            </div>
          </div>

          <!-- Studiepunten filter -->
          <div class="mb-6">
            <h4 class="text-sm font-semibold text-slate-700 mb-3">Studiepunten</h4>
            <div class="space-y-2">
              <label 
                v-for="credit in filterOptions.studyCredits" 
                :key="credit.value" 
                class="flex items-center cursor-pointer p-3 hover:bg-purple-50 rounded-lg transition-colors group"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedFilters.studyCredits.includes(credit.value)"
                  @change="toggleStudyCreditFilter(credit.value)"
                  class="rounded border-slate-300 text-purple-600 focus:ring-purple-500 focus:ring-2"
                />
                <span class="ml-3 text-sm text-slate-700 flex-1 group-hover:text-purple-600">{{ credit.value }} credits</span>
                <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{{ credit.count }}</span>
              </label>
            </div>
          </div>

          <!-- Level filter -->
          <div class="mb-6">
            <h4 class="text-sm font-semibold text-slate-700 mb-3">Niveau</h4>
            <div class="space-y-2">
              <label 
                v-for="level in filterOptions.levels" 
                :key="level.value" 
                class="flex items-center cursor-pointer p-3 hover:bg-green-50 rounded-lg transition-colors group"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedFilters.levels.includes(level.value)"
                  @change="toggleLevelFilter(level.value)"
                  class="rounded border-slate-300 text-green-600 focus:ring-green-500 focus:ring-2"
                />
                <span class="ml-3 text-sm text-slate-700 flex-1 group-hover:text-green-600">{{ level.value }}</span>
                <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{{ level.count }}</span>
              </label>
            </div>
          </div>

          <!-- Reset filters knop -->
          <button 
            @click="clearFilters"
            v-if="selectedFilters.locations.length > 0 || selectedFilters.studyCredits.length > 0 || selectedFilters.levels.length > 0"
            class="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Filters wissen
          </button>
        </div>
      </div>

      <!-- Modules Content -->
      <div class="lg:col-span-3">
        <div v-if="loading" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p class="text-slate-600 text-lg">Modules laden...</p>
        </div>



        <div v-else-if="modules.length === 0" class="text-center py-16">
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-12 inline-block">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-700 mb-3">Geen modules gevonden</h3>
            <p class="text-slate-500 mb-6 max-w-md">Er zijn nog geen modules beschikbaar of je filters hebben geen resultaten opgeleverd.</p>
            <button @click="goToCreate" class="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
              Eerste Module Maken
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div 
            v-for="module in modules" 
            :key="module.id" 
            @click="viewModule(module.id)"
            class="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative"
          >
            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-red-50/0 to-rose-50/0 group-hover:from-red-50/50 group-hover:to-rose-50/50 transition-all duration-300 rounded-2xl"></div>
            
            <div class="relative z-10">
              <!-- Header -->
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1 pr-4">
                  <h3 class="text-xl font-bold text-slate-800 group-hover:text-red-500 transition-colors duration-200 mb-2">{{ module.name }}</h3>
                  <p class="text-slate-600 leading-relaxed">{{ module.shortdescription }}</p>
                </div>
                
                <div class="flex items-center gap-3">
                  <!-- View indicator -->
                  <div class="text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  
                  <!-- Dropdown menu -->
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
                    
                    <!-- Dropdown menu -->
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
              
              <!-- Info badges -->
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
                  {{ module.studycredit }} credits
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

        <!-- Paginering -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex items-center gap-2">
            <!-- Vorige pagina knop -->
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'"
              class="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors"
            >
              ←
            </button>

            <!-- Pagina nummers -->
            <template v-for="page in totalPages" :key="page">
              <button 
                v-if="page <= 5 || (totalPages > 5 && page === totalPages)"
                @click="goToPage(page)"
                :class="currentPage === page ? 'bg-red-500 text-white' : 'bg-white text-slate-700 hover:bg-red-100'"
                class="px-3 py-2 rounded-lg border border-slate-200 transition-colors min-w-[40px]"
              >
                {{ page }}
              </button>
              <span v-if="totalPages > 5 && page === 5 && totalPages > 6" class="px-2 text-slate-500">...</span>
            </template>

            <!-- Volgende pagina knop -->
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'"
              class="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
</style>