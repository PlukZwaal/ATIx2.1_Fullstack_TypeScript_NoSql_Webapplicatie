<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <!-- Hero Section -->
    <div class="container mx-auto px-6 text-center max-w-4xl">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Welkom bij Avans Modules
      </h1>
      <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
        Ontdek en beheer alle beschikbare modules van Avans Hogeschool. 
        Van beginner tot expert niveau - vind de perfecte module voor jouw ontwikkeling.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link 
          to="/modules" 
          class="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition-colors"
        >
          Bekijk Modules
        </router-link>
        <router-link 
          to="/modules/create" 
          class="bg-green-600 text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors"
        >
          Nieuwe Module
        </router-link>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-6 py-12 max-w-4xl">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Waarom Avans Modules?</h2>
        <p class="text-gray-600">
          Een overzichtelijke manier om alle modules te bekijken, filteren en beheren
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feature 1 -->
        <div class="bg-white border border-gray-200 rounded p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Slim Zoeken</h3>
          <p class="text-gray-600 text-sm">
            Vind snel de juiste module met filters op locatie, niveau en studiecredits.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white border border-gray-200 rounded p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Volledig Overzicht</h3>
          <p class="text-gray-600 text-sm">
            Bekijk gedetailleerde informatie over elke module inclusief inhoud en leeruitkomsten.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white border border-gray-200 rounded p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Eenvoudig Beheer</h3>
          <p class="text-gray-600 text-sm">
            Maak, bewerk en beheer modules met onze gebruiksvriendelijke interface.
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="border-t border-gray-200 bg-white py-8">
      <div class="container mx-auto px-6 text-center max-w-2xl">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Klaar om te beginnen?
        </h2>
        <p class="text-gray-600 mb-6">
          Ontdek alle beschikbare modules en vind de perfecte match voor jouw leerdoelen.
        </p>
        <router-link 
          to="/modules" 
          class="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition-colors"
        >
          Start Nu
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style> 