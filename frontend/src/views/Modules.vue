<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

const showMenus = ref<{[key: string]: boolean}>({});
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
    modules.value = response.data;
  } catch (err) {
    error.value = 'Fout bij laden modules';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Laad filter opties eerst
  await loadFilterOptions();
  // Dan modules
  await loadModules();
  
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
  
  // Check voor delete melding
  if (router.currentRoute.value.query.deleted === 'true') {
    successMessage.value = 'Module succesvol verwijderd!';
    // Verwijder de query parameter uit de URL
    router.replace({ path: '/modules' });
    // Verberg de melding na 3 seconden
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
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
    successMessage.value = 'Module succesvol verwijderd!';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Fout bij verwijderen module');
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

const clearFilters = () => {
  selectedFilters.value.locations = [];
  selectedFilters.value.studyCredits = [];
  selectedFilters.value.levels = [];
  loadModules();
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="container mx-auto px-6 py-8 max-w-7xl">
      <!-- Header met titel en nieuwe module knop -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-semibold text-gray-800">Modules</h1>
        </div>
        <button 
          @click="goToCreate"
          class="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded font-medium transition-colors duration-200"
        >
          + Nieuwe Module
        </button>
      </div>

      <!-- Succesmelding -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Grid layout: Filter sidebar + Modules -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filter Sidebar (1/4 van de breedte) -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded border border-gray-200 p-4">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Filters</h3>
          
          <!-- Locatie filter -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Locatie</h4>
            <div class="space-y-2">
              <label 
                v-for="location in filterOptions.locations" 
                :key="location.value" 
                class="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedFilters.locations.includes(location.value)"
                  @change="toggleLocationFilter(location.value)"
                  class="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span class="ml-2 text-sm text-gray-700 flex-1">{{ location.value }}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ location.count }}</span>
              </label>
            </div>
          </div>

          <!-- Studiepunten filter -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Studiepunten</h4>
            <div class="space-y-2">
              <label 
                v-for="credit in filterOptions.studyCredits" 
                :key="credit.value" 
                class="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedFilters.studyCredits.includes(credit.value)"
                  @change="toggleStudyCreditFilter(credit.value)"
                  class="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span class="ml-2 text-sm text-gray-700 flex-1">{{ credit.value }} credits</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ credit.count }}</span>
              </label>
            </div>
          </div>

          <!-- Level filter -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Niveau</h4>
            <div class="space-y-2">
              <label 
                v-for="level in filterOptions.levels" 
                :key="level.value" 
                class="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded"
              >
                <input 
                  type="checkbox" 
                  :checked="selectedFilters.levels.includes(level.value)"
                  @change="toggleLevelFilter(level.value)"
                  class="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span class="ml-2 text-sm text-gray-700 flex-1">{{ level.value }}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ level.count }}</span>
              </label>
            </div>
          </div>

          <!-- Reset filters knop -->
          <button 
            @click="clearFilters"
            v-if="selectedFilters.locations.length > 0 || selectedFilters.studyCredits.length > 0 || selectedFilters.levels.length > 0"
            class="w-full bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Filters wissen
          </button>
        </div>
      </div>

      <!-- Modules Content (3/4 van de breedte) -->
      <div class="lg:col-span-3">
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600">Modules laden...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="loadModules" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors">
            Opnieuw proberen
          </button>
        </div>

        <div v-else-if="modules.length === 0" class="text-center py-8">
          <p class="text-gray-700 mb-2">Geen modules gevonden</p>
          <p class="text-gray-500 mb-4">Er zijn nog geen modules beschikbaar of je filters hebben geen resultaten opgeleverd.</p>
          <button @click="goToCreate" class="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded font-medium transition-colors">
            Eerste Module Maken
          </button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="module in modules" 
            :key="module.id" 
            @click="viewModule(module.id)"
            class="bg-white border border-gray-200 rounded p-4 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all duration-200 relative"
          >
            <!-- Module naam met arrow indicator -->
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-xl font-semibold text-gray-800">{{ module.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-sm">→</span>
                
                <!-- Dropdown menu button -->
                <div class="relative">
                  <button 
                    @click="toggleMenu(module.id, $event)"
                    class="text-gray-500 hover:text-gray-700 px-2 py-1 text-lg transition-colors"
                    title="Meer opties"
                  >
                    ⋮
                  </button>
                  
                  <!-- Dropdown menu -->
                  <div v-if="showMenus[module.id]" class="absolute right-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-32">
                    <button 
                      @click="editModule(module.id, $event)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Bewerken
                    </button>
                    <button 
                      @click="deleteModule(module.id, $event)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Korte beschrijving -->
            <p class="text-gray-600 mb-3">{{ module.shortdescription }}</p>
            
            <!-- Info badges -->
            <div class="flex flex-wrap gap-2 text-sm">
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded">{{ module.location }}</span>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded">{{ module.studycredit }} credits</span>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded">{{ module.level }}</span>
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