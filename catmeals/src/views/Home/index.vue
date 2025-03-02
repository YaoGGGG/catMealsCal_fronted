<template>

    <div class="bg-amber-50 text-amber-800 min-h-screen p-8">
        <div class="max-w-6xl mx-auto">
            <div class="flex items-center">
                <div class="w-1/2 pr-8">
                    <h1 class="text-6xl font-bold mb-2">
                        <span class="text-amber-800">Meow</span>
                        <span class="text-red-400">Meals</span>
                    </h1>
                    <h3 class="text-xl mb-6">Only Two Steps to Get Your Cat's Healthy Diet</h3>
                    <!-- <p class="mb-6">1. Add your cat's profile;   2. Create the reciept</p> -->
                    <div class="space-x-4">
                        <button class="bg-amber-400 text-amber-800 px-6 py-2 rounded-full hover:bg-amber-500">Add Your Cats</button>
                        <button class="text-amber-800 px-6 py-2 rounded-full border border-amber-800 hover:bg-amber-100">Create Recipe</button>
                    </div>
                </div>
                <div class="w-1/2 relative">
                <img src="@/assets/HomePageGraphic.png" alt="Happy cat" class="rounded-lg w-full" />
            </div>
        </div>
    </div>

    <!-- benefits -->
    <div class="bg-amber-50  p-8">
        <div class="max-w-6xl mx-auto">
            <h1 class="text-4xl font-bold mb-4 text-amber-900">MORE THAN JUST CAT FOOD.</h1>
            <p class="mb-8 text-amber-800">
                We offer expert nutritional guidance and personalized meal plans to help your cat achieve optimal health with ease. Our focus is on providing the best care and advice for every feline friend, ensuring their well-being through proper nutrition.        
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div v-for="(card, index) in cards" :key="index" class="bg-white rounded-lg shadow-md p-6">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <span class="text-2xl">{{ card.icon }}</span>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-amber-800">{{ card.title }}</h3>
                <p class="text-amber-800 mb-4">{{ card.description }}</p>
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-6 md:mb-0">
                <img src="@/assets/BenefitsPageGraphic.png" alt="Happy cat" class="w-full h-auto rounded-lg" />
            </div>
            <div class="md:w-1/2 md:pl-8">
                <h2 class="text-3xl font-bold mb-4 text-amber-900">HAPPY CATS, HEALTHIER LIVES</h2>
                <p class="text-amber-800 mb-4">
                    Our raw diet guidance enhances cats' health, energy, and well-being, catering to all life stages and needs.
                </p>
                <p class="text-amber-800">
                    Experience improvements in your cat's coat, digestion, and vitality with natural, nutrient-rich nutrition.
                </p>
            </div>
        </div>
    </div>
  </div>

    </div>

</template>
<script>
export default {
  data() {
    return {
      cards: [
        {
          icon: '🥩',
          title: 'Easily Accessible Raw Ingredients',
          description: 'We help cat owners find quality ingredients to easily prepare nutritious meals at home.'
        },
        {
          icon: '🍽️',
          title: '10\'s of Diverse Recipes',
          description: 'Our vast selection of recipes caters to all tastes and dietary needs, ensuring your cat never gets bored.'
        },
        {
          icon: '👨‍⚕️',
          title: 'Allergen-Free Meal Planning',
          description: 'Eliminate allergens to prevent digestive issues like diarrhea and promote better health.'
        }
      ],
      benefits: [
        "Improved digestion",
        "Healthier skin and coat",
        "Increased energy levels",
        "Better weight management",
        "Reduced risk of diseases"
      ]
    }
  }
}
</script>