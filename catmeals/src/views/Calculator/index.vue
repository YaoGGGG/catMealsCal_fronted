<template>
  <div class="bg-amber-50 min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold text-amber-900 mb-6">Recipe Calculator</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Original Recipe Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-amber-900 mb-4" v-if="selectedRecipe"> {{ selectedRecipe ? selectedRecipe.recipe_name : "Loading recipe..." }}</h2>
          

            <div class="bg-amber-50 p-4 rounded-lg mb-4">
              <span v-if="loading">Loading recipe...</span>
              <span v-else>{{ selectedRecipe ? selectedRecipe.recipe_name : "No recipe available" }}</span>
            </div>

            <div class="bg-amber-50 p-4 rounded-lg mb-4">
                <p v-if="loading">Loading description...</p>
                <p v-else-if="selectedRecipe">{{ selectedRecipe.description || 'No description available' }}</p>
                <p v-else>No recipe selected</p>
            </div>

          <h3 class="text-xl font-semibold text-amber-800 mb-2">Components (amount per kg):</h3>
          <ul class="list-disc pl-5 mb-4" v-if="selectedRecipe && selectedRecipe.components">
            <li v-for="item in selectedRecipe.components" :key="item.component.id" class="mb-2">
              {{ item.component.name }} {{ item.amount_per_1000g }}{{ item.component.unit }}
            </li>
          </ul>
          <p v-else-if="!loading">No components available.</p>
        </div>

        <!-- Calculator Result Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold text-amber-900 mb-4">Result</h2>
          
          <!-- Multi Cat Selection -->
        <div  v-if="isLoggedIn">
          <div class="mb-4">
            <label class="block text-amber-800 font-semibold mb-2">Select Your Cats:</label>
            <div class="space-y-2 max-h-48 overflow-y-auto border border-amber-200 rounded-lg p-3">
              <div v-for="cat in cats" :key="cat.id" class="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  :value="cat.id"
                  v-model="selectedCats"
                  class="rounded border-amber-300 text-amber-500 focus:ring-amber-400"
                >
                <label class="flex-1">
                  <span class="text-amber-900">{{ cat.name }}</span>
                  <span class="text-amber-600 text-sm ml-2">({{ calculateAge(cat.birthday).years }}y {{ calculateAge(cat.birthday).months }}m)</span>
                </label>
                <span class="text-amber-600 text-sm">{{ cat.weight }}kg</span>
              </div>
            </div>
          </div>

          <!-- Duration Selection -->
          <div class="mb-6">
            <label class="block text-amber-800 font-semibold mb-2">Duration:</label>
            <div class="flex items-center gap-2">
              <input 
                type="number" 
                v-model="duration" 
                min="1"
                class="w-24 p-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
              <span class="text-amber-800">days</span>
            </div>
          </div>
        </div>
        <div v-else class="p-4">
            <p class="text-amber-800 text-lg font-semibold mb-2">Can not calculate with no cat information.</p>
            <p class="text-amber-800 text-lg font-semibold mb-2">Please log in to use the calculator.</p>
        </div>
          <!-- Selected Cats Summary -->
          <!-- <div v-if="selectedCats.length" class="mb-6 bg-amber-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-amber-800 mb-2">Selected Cats:</h3>
            <ul class="space-y-1">
              <li v-for="catId in selectedCats" :key="catId" class="text-amber-700">
                {{ getCatName(catId) }} - {{ getCatDailyPortion(catId) }}g daily portion
              </li>
            </ul>
          </div> -->

          <!-- Calculated Results -->
          <div v-if="selectedCats.length && duration" class="mt-6">
            <h3 class="text-xl font-semibold text-amber-800 mb-4">Total Ingredients Needed:</h3>
            <ul class="space-y-3">
              <li v-for="(amount, component) in calculatedResults.ingredients" 
                  :key="component" class="flex justify-between">
                <span class="text-amber-900">{{ component }}:</span>
                <span class="font-semibold text-amber-800">{{ amount }}</span>
              </li>
              <li class="flex justify-between border-t pt-3 mt-3">
              <span class="text-amber-900 font-bold">Total Amount of Food:</span>
              <span class="font-semibold text-amber-800">{{ calculatedResults.totalAmount }}</span>
              </li>
              <li class="flex justify-between border-t pt-3 mt-3">
              <span class="text-amber-900 font-bold">Total Amount of Food Per Day:</span>
              <span class="font-semibold text-amber-800">{{ calculatedResults.amountPerDay }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/apiClient';

export default {
  name: 'RecipeCalculator',
  
  data() {
    return {
      selectedRecipe: null,
      cats: [],
      selectedCats: [], // Array of selected cat IDs
      duration: 1,
      calculatedComponents: {},
      defaultRecipeImage: '/path/to/default/image.jpg',
      loading:true,
    };
  },
  
  computed: {
    //dynamically judge whether logged in or not
    isLoggedIn(){
        return !!localStorage.getItem('access_token')
    },
    calculatedResults() {
      if (!this.selectedCats.length || !this.duration || !this.selectedRecipe) {
        return {
          ingredients: {},
          totalAmount: '0 g',
          amountPerDay: '0 g'
        };
      }

      // Calculate total daily portion for all selected cats
      //sum of Weight * percents of food per weight
      const totalDailyMultiplier = this.selectedCats.reduce((total, catId) => {
        const cat = this.cats.find(c => c.id === catId);
        return total + this.getDailyPortionMultiplier(cat);
      }, 0);

      //duration * sum(weight * percents of food per weight)
      const totalMultiplier = totalDailyMultiplier * this.duration;

      const ingredients = {};
      let totalAmount = 0;

      this.selectedRecipe.components.forEach(item => {
        const calculatedAmount = item.amount_per_1000g * totalMultiplier;
        totalAmount += calculatedAmount;
        if (item.component) {
          ingredients[item.component.name] = `${calculatedAmount.toFixed(1)} ${item.component.unit}`;
        }
      });
      return {
        ingredients,
        totalAmount: `${totalAmount.toFixed(1)} g`,
        amountPerDay:  `${(totalAmount / this.duration).toFixed(1)} g`
      };
    }
  },
  
  created() {
    this.fetchRecipe();
    if(this.isLoggedIn){
      this.fetchCats();
    }
  },

  methods: {
    async fetchRecipe() {
      const recipeId = this.$route.params.id;
      console.log("Recipe ID:",recipeId)
      if (!recipeId) {
      console.error('No recipe ID found in route');
      return;
    }
      this.loading=true;
      try {
        const response = await apiClient.get(`/api/recipes/${recipeId}`);
        this.selectedRecipe = response.data;
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }finally{
        this.loading=false;
      }
    },

    async fetchCats() {
      if (!this.isLoggedIn) return;
      try {
        const response = await apiClient.get('/api/cats/');
        this.cats = response.data;
      } catch (error) {
        console.error('Error fetching cats:', error);
      }
    },
    
    calculateAge(dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      return { years, months };
    },

    getCatName(catId) {
      const cat = this.cats.find(c => c.id === catId);
      return cat ? cat.name : '';
    },

    getCatDailyPortion(catId) {
      const cat = this.cats.find(c => c.id === catId);
      if (!cat) return 0;
      return (this.getDailyPortionMultiplier(cat) * 1000).toFixed(0);
    },

    getDailyPortionMultiplier(cat) {
      const age = this.calculateAge(cat.birthday);
      const isKitten = age.years < 1;
      const weight = parseFloat(cat.weight);
      
      let dailyPortionPercentage = 0.03; //adult percentage
      if (isKitten){
        if (age.months >= 10) {
          dailyPortionPercentage = 0.045; // 4.5% of weight
        } else if (age.months >= 8) {
          dailyPortionPercentage = 0.055; // 5.5% of weight
        } else if (age.months >= 6) {
          dailyPortionPercentage = 0.065; // 6.5% of weight
        } else if (age.months >= 5) {
          dailyPortionPercentage = 0.075; // 7.5% of weight
        } else if (age.months >= 3) {
          dailyPortionPercentage = 0.085; // 8.5% of weight
        } else {
          dailyPortionPercentage = 0.095;
      }
    }
      // if (weight < 3) multiplier *= 1.2;
      // else if (weight > 5) multiplier *= 0.8;
      return weight * dailyPortionPercentage;
    }
  }
};
</script>