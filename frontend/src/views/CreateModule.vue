<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div class="container mx-auto px-6 max-w-4xl">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-semibold text-gray-800">Nieuwe Module</h1>
      </div>

      <!-- Form Card -->
      <div class="bg-white border border-gray-200 rounded p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basis informatie -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-4">Basis Informatie</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Naam *</label>
                <input 
                  type="text" 
                  v-model="formData.name" 
                  required 
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Naam van de module"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Locatie *</label>
                <input 
                  type="text" 
                  v-model="formData.location" 
                  required 
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Waar wordt de module gegeven?"
                />
              </div>
            </div>
          </div>

          <!-- Beschrijving -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-4">Beschrijving</h3>
            <div class="space-y-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Korte Beschrijving *</label>
                <input 
                  type="text" 
                  v-model="formData.shortdescription" 
                  required 
                  maxlength="150"
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Korte samenvatting van de module"
                />
                <small class="text-gray-500 mt-1 block">Max 150 karakters</small>
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Uitgebreide Beschrijving *</label>
                <textarea 
                  v-model="formData.description" 
                  required 
                  rows="3"
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Gedetailleerde beschrijving van de module"
                ></textarea>
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Module Inhoud *</label>
                <textarea 
                  v-model="formData.content" 
                  required 
                  rows="4"
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Wat wordt er behandeld in deze module?"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-4">Module Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Studiecredits *</label>
                <input 
                  type="number" 
                  v-model.number="formData.studycredit" 
                  required 
                  min="0"
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Aantal credits"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">Niveau *</label>
                <input 
                  type="text" 
                  v-model="formData.level" 
                  required 
                  class="w-full border border-gray-300 focus:border-gray-600 p-2 rounded"
                  placeholder="Bijv. Beginnend, Gevorderd, Expert"
                />
              </div>
            </div>
          </div>

          <!-- Leeruitkomsten -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-4">Leeruitkomsten</h3>
            <div class="space-y-2">
              <div v-for="(_, index) in formData.learningoutcomes" :key="index" class="flex gap-2 items-center">
                <input 
                  type="text" 
                  v-model="formData.learningoutcomes[index]" 
                  class="flex-1 border border-gray-300 focus:border-gray-600 p-2 rounded"
                  :placeholder="`Leeruitkomst ${index + 1}`"
                />
                <button 
                  type="button" 
                  @click="removeLearningOutcome(index)" 
                  v-if="formData.learningoutcomes.length > 1"
                  class="px-2 py-2 text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <button 
                type="button" 
                @click="addLearningOutcome"
                class="w-full py-2 border border-dashed border-gray-300 text-gray-600 rounded hover:border-gray-400"
              >
                + Leeruitkomst toevoegen
              </button>
            </div>
          </div>

          <!-- Submit knoppen -->
          <div class="flex gap-3 pt-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="flex-1 bg-gray-900 text-white py-2 px-4 rounded font-medium hover:bg-black disabled:bg-gray-400 transition-colors"
            >
              <span v-if="isSubmitting">Bezig met opslaan...</span>
              <span v-else>Module Aanmaken</span>
            </button>
            <router-link 
              to="/modules" 
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Annuleren
            </router-link>
          </div>
        
          <!-- Feedback berichten -->
          <div v-if="error || success" class="mt-4">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {{ error }}
            </div>
            <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded">
              {{ success }}
            </div>
          </div>
        </form>
      </div>
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
