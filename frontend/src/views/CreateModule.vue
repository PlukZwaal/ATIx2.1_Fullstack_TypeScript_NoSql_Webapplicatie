<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 class="text-2xl mb-6">Nieuwe Module Aanmaken</h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium">Naam *</label>
            <input type="text" v-model="formData.name" required class="w-full border p-2 rounded" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Locatie *</label>
            <input type="text" v-model="formData.location" required class="w-full border p-2 rounded" />
          </div>
        </div>

        <div>
          <label class="block mb-1 font-medium">Korte Beschrijving *</label>
          <input type="text" v-model="formData.shortdescription" required class="w-full border p-2 rounded" maxlength="150" />
          <small class="text-gray-500">Max 150 karakters</small>
        </div>

        <div>
          <label class="block mb-1 font-medium">Beschrijving *</label>
          <textarea v-model="formData.description" required class="w-full border p-2 rounded h-24 resize-none"></textarea>
        </div>

        <div>
          <label class="block mb-1 font-medium">Inhoud *</label>
          <textarea v-model="formData.content" required class="w-full border p-2 rounded h-32 resize-none"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium">Studiecredits *</label>
            <input type="number" v-model.number="formData.studycredit" required min="0" class="w-full border p-2 rounded" />
          </div>

          <div>
            <label class="block mb-1 font-medium">Niveau *</label>
            <input type="text" v-model="formData.level" required class="w-full border p-2 rounded" placeholder="Bijv. Beginnend, Gevorderd, Expert" />
          </div>
        </div>

        <div>
          <label class="block mb-1 font-medium">Leeruitkomsten *</label>
          <div class="space-y-2">
            <div v-for="(outcome, index) in formData.learningoutcomes" :key="index" class="flex gap-2">
              <input 
                type="text" 
                v-model="formData.learningoutcomes[index]" 
                class="flex-1 border p-2 rounded" 
                :placeholder="`Leeruitkomst ${index + 1}`"
              />
              <button 
                type="button" 
                @click="removeLearningOutcome(index)"
                v-if="formData.learningoutcomes.length > 1"
                class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
            <button 
              type="button" 
              @click="addLearningOutcome"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Leeruitkomst toevoegen
            </button>
          </div>
        </div>

        <div class="flex gap-4">
          <button type="submit" class="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800">
            Module Aanmaken
          </button>
          <router-link 
            to="/modules" 
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 text-center"
          >
            Annuleren
          </router-link>
        </div>
        
        <p v-if="error" class="text-red-500">{{ error }}</p>
        <p v-if="success" class="text-green-500">{{ success }}</p>
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
  try {
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
    
    // Doorsturen naar modules pagina met succesmelding
    router.push('/modules?created=true');
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Module aanmaken mislukt. Probeer het opnieuw.';
  }
};
</script>

<style scoped>
</style>
