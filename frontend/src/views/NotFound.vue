<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="text-center max-w-2xl">
      <!-- Background decorations -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-20 right-10 w-20 h-20 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-20 h-20 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <!-- 404 Illustration -->
      <div class="relative mb-8">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-400 to-rose-500 rounded-full mb-6 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <!-- Floating question marks -->
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold animate-bounce">?</div>
          <div class="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce animation-delay-1000">?</div>
        </div>
      </div>

      <!-- Error Content -->
      <div class="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 relative">
        <h1 class="text-6xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 class="text-3xl font-bold text-slate-800 mb-4">
          Oops! Pagina niet gevonden
        </h2>
        <p class="text-slate-600 text-lg mb-8 max-w-md mx-auto">
          De pagina die je zoekt bestaat niet, is verplaatst, of er is een fout opgetreden in de URL.
        </p>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/" 
            class="bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V9a1 1 0 011-1h2a1 1 0 011 1v12m0 0h3a1 1 0 001-1V10M9 21h6" />
            </svg>
            Terug naar Home
          </router-link>
          <router-link 
            to="/modules" 
            class="bg-white/80 backdrop-blur-sm border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold hover:bg-white hover:border-slate-400 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Bekijk Modules
          </router-link>
        </div>

        <!-- Help text -->
        <div class="mt-8 pt-6 border-t border-slate-200">
          <p class="text-slate-500 text-sm">
            Heb je hulp nodig? Controleer de URL of probeer een van de bovenstaande opties.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>