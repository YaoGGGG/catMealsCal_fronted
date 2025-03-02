<!-- Modal.vue -->
<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 class="text-2xl font-semibold mb-4">{{ title }}</h2>
        <p class="mb-4">{{ message }}</p>
  
        <!-- Show cat details to confirm -->
        <div>
          <p><strong>Name:</strong> {{ cat.name }}</p>
          <p><strong>Birthday:</strong> {{ formatDate(cat.birthday) }}</p>
          <p><strong>Weight:</strong> {{ cat.weight }} kg</p>
          <p><strong>Health Condition:</strong> {{ cat.health_condition || 'N/A' }}</p>
        </div>
  
        <div class="flex justify-end mt-4 space-x-4">
          <button @click="cancel" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          <button @click="confirm" class="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600">Confirm</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      visible: Boolean,
      title: String,
      message: String,
      cat: Object // Pass the cat object to display
    },
    methods: {
      confirm() {
        this.$emit('confirm');
      },
      cancel() {
        this.$emit('cancel');
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      }
    }
  };
  </script>