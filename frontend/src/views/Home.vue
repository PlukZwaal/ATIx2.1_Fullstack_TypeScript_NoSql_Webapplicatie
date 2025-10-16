<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="min-h-screen py-12 px-6">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Avans Modules Platform</h1>
      
      <div class="bg-white rounded-lg border border-slate-200 p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">Over deze applicatie</h2>
        <p class="text-slate-600 mb-4">
          Een fullstack webapplicatie voor het beheren van onderwijsmodules, gebouwd met TypeScript en NoSQL.
        </p>
        <button 
          @click="router.push('/modules')"
          class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
        >
          Bekijk Modules
        </button>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <h2 class="text-xl font-bold mb-4">Functionaliteiten</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-bold mb-2">1. Login/Register Systeem</h3>
              <p class="text-slate-600">Gebruikers kunnen registreren en inloggen met JWT authenticatie</p>
            </div>
            
            <div>
              <h3 class="font-bold mb-2">2. CRUD voor Modules</h3>
              <ul class="text-slate-600 list-disc list-inside">
                <li>Create - Modules aanmaken</li>
                <li>Read - Modules bekijken</li>
                <li>Update - Modules bewerken</li>
                <li>Delete - Modules verwijderen</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-bold mb-2">3. Favorieten (Hartjes)</h3>
              <p class="text-slate-600">Modules kunnen worden gemarkeerd als favoriet per gebruiker</p>
            </div>
            
            <div>
              <h3 class="font-bold mb-2">4. Comments Systeem</h3>
              <p class="text-slate-600">Laat comments achter onder modules voor discussie en feedback</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <h2 class="text-xl font-bold mb-4">Technologie</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="font-bold mb-2">Frontend</h3>
              <ul class="text-slate-600 text-sm space-y-1">
                <li>• Vue 3</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 class="font-bold mb-2">Backend</h3>
              <ul class="text-slate-600 text-sm space-y-1">
                <li>• Node.js + Express</li>
                <li>• TypeScript</li>
                <li>• MongoDB (NoSQL)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style> 