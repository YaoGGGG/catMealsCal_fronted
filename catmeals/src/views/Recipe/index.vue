<template>
    <div class="bg-amber-50 min-h-screen p-8">
      <!-- Data Source Information -->
      <div class="bg-amber-100 p-4 rounded-md text-center mb-6">
        <p class="text-amber-800 font-serif text-lg">
          Data for the recipes are based on scientifically-backed sources. We’ve referenced nutritional requirements for adult cats as recommended by
          <a href="https://perfectlyrawsome.com" target="_blank" class="text-red-500 underline hover:text-red-700">Perfectly Rawsome</a>
          and the 
          <a href="https://perfectlyrawsome.com/raw-feeding-knowledgebase/nrc-nutritional-requirements-for-adult-cats/" target="_blank" class="text-red-500 underline hover:text-red-700">NRC Nutritional Guidelines</a>.
        </p>
      </div>
      <!-- Page header -->
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-amber-900 mb-6">Recipes</h1>
  
        <!-- Recipe card -->
        <div v-if="Array.isArray(recipes) && recipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(recipe, index) in recipes" :key="recipe.id" class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-h-[20rem] min-w-[20rem] max-w-[24rem]">
          <h2 class="text-3xl font-semibold text-amber-900 mb-4">{{ recipe.recipe_name }}</h2>
          <!-- Description -->
          <p class="text-lg mb-4">{{ recipe.description }}</p>
          <p class="text-lg font-semibold mt-auto">Contains: {{ getContainsEmoji(recipe.components || []) }}</p>
          
  
          <!-- Select Recipe Button -->
          <div class="mt-6 text-center">
            <RouterLink :to="`/calculator/${recipe.id}`">
              <button class="bg-amber-400 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-400 transition">
                Select This Recipe
              </button>
            </RouterLink>
          </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/services/apiClient';
  
  export default {
    data() {
      return {
        recipes: [], // Will store the recipe data fetched from the backend
      };
    },
    created() {
    this.fetchRecipes();
  },

  methods: {
    async fetchRecipes() {
      try {
        const response = await apiClient.get('/api/recipes/');
      console.log('Fetched recipes:', response.data); 
      this.recipes = response.data;
      console.log('Updated recipes:', this.recipes); 
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    },

    getContainsEmoji(components) {
      if (!Array.isArray(components)) {
        console.warn("Expected 'components' to be an array but got:", components);
        return ' '; // Default emoji if components is not an array
      }
        const containsEmojis = new Set();
        const orderedCategories = [
            { category: 'chicken', emoji: '🐥' },
            { category: 'rabbit', emoji: '🐇' },
            { category: 'duck', emoji: '🦆' },
            { category: 'beef', emoji: '🐄' },
            { category: 'pork', emoji: '🐖' },
            { category: 'mussel', emoji: '🦪' },
            { category: 'fish', emoji: '🐟' },
            { category: 'supplement', emoji: '💊' }
          ];

  
          orderedCategories.forEach(({ category,emoji }) => {
          if (components.some(({ component }) => component && component.category && component.category.toLowerCase() === category)) {
            containsEmojis.add(emoji);
          }
        });
  
        // Convert Set to a string with emojis separated by spaces
        return containsEmojis.size > 0 ? Array.from(containsEmojis).join(' ') : '🥩';
      }
  },

  };
  </script>
  
  <style scoped>
   /* Custom styling for the data source information */
   a {
    text-decoration: underline;
  }
  </style>
  