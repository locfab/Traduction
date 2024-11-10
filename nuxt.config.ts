// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true, // active le rendu côté serveur, tu peux le mettre à `false` pour le rendu côté client
  css: [
    // Ajoute tes fichiers CSS ou bibliothèques ici
  ],
  modules: [
    // Ajoute les modules ici si nécessaire
  ]
})
