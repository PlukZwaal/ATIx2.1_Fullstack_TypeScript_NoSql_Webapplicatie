<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getModuleById, getCommentsByModuleId, createComment } from '../services/api';
import { useToast } from '../composables/useToast';
import { useAuthStore } from '../stores/auth';
import type { Module, Comment, CreateCommentData } from '../types';

const router = useRouter();
const route = useRoute();
const { error: showError, success: showSuccess } = useToast();
const authStore = useAuthStore();
const module = ref<Module | null>(null);
const comments = ref<Comment[]>([]);
const loading = ref(true);
const commentsLoading = ref(false);
const newComment = ref('');
const submittingComment = ref(false);

const loadModule = async () => {
  try {
    loading.value = true;
    module.value = await getModuleById(route.params.id as string);
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij laden module');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const loadComments = async () => {
  try {
    commentsLoading.value = true;
    comments.value = await getCommentsByModuleId(route.params.id as string);
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij laden comments');
    console.error(err);
  } finally {
    commentsLoading.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    submittingComment.value = true;
    const commentData = {
      moduleId: route.params.id as string,
      description: newComment.value.trim()
    };
    await createComment(commentData as CreateCommentData);
    newComment.value = '';
    showSuccess('Comment toegevoegd!');
    await loadComments(); // Herlaad comments
  } catch (err: any) {
    showError(err?.response?.data?.message || 'Fout bij toevoegen comment');
    console.error(err);
  } finally {
    submittingComment.value = false;
  }
};



const goBack = () => {
  router.push('/modules');
};

onMounted(() => {
  loadModule();
  loadComments();
  
  // Check voor update melding
  if (router.currentRoute.value.query.updated === 'true') {
    // Clean URL zonder extra melding (toast is al getoond in EditModule)
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
                  <span class="font-medium">{{ module.studycredit }} ECTS</span>
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

        <!-- Comments sectie -->
        <div class="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-800">Comments</h2>
          </div>

          <!-- Nieuwe comment toevoegen -->
          <div v-if="authStore.isAuthenticated" class="mb-6">
            <textarea
              v-model="newComment"
              placeholder="Schrijf een comment..."
              class="w-full p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
            ></textarea>
            <button
              @click="submitComment"
              :disabled="!newComment.trim() || submittingComment"
              class="mt-3 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span v-if="submittingComment">Bezig met plaatsen...</span>
              <span v-else>Comment plaatsen</span>
            </button>
          </div>

          <!-- Login prompt -->
          <div v-else class="mb-6 p-4 bg-slate-50 rounded-xl text-center">
            <p class="text-slate-600 mb-2">Log in om een comment te plaatsen</p>
            <router-link
              to="/login"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Inloggen
            </router-link>
          </div>

          <!-- Comments lijst -->
          <div v-if="commentsLoading" class="text-center py-8">
            <div class="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p class="text-slate-600 mt-2">Comments laden...</p>
          </div>

          <div v-else-if="comments.length === 0" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-slate-500">Nog geen comments. Wees de eerste!</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="bg-slate-50 rounded-xl p-4"
            >
              <div class="mb-2">
                <h4 class="font-semibold text-slate-800">{{ comment.userName }}</h4>
              </div>
              <p class="text-slate-700 mb-2">{{ comment.description }}</p>
              <p class="text-xs text-slate-500">{{ new Date(comment.createdAt).toLocaleString('nl-NL') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>