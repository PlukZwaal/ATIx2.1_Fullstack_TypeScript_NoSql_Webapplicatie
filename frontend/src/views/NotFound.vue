<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="container mx-auto px-6 text-center max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">404 - Pagina niet gevonden</h1>
      <p class="text-gray-600 mb-6">De pagina die je zoekt bestaat niet of is verplaatst.</p>
      <router-link 
        to="/" 
        class="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Terug naar Home
      </router-link>
    </div>
  </div>
</template>