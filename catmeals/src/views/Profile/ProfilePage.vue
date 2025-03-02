<template>
   <div class="bg-amber-50 min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold text-amber-900 mb-6">{{ user.name }}'s Dashboard</h1>
      
      <!--Cat information card layout-->
      <h2 class="text-2xl font-semibold text-amber-800 mb-4">Cats Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="cat in cats" :key="cat.cat_id" class="bg-white p-6 rounded-lg shadow-md">

          <div class="w-24 h-24 mb-4 mx-auto">
            <img :src="cat.avatar || defaultAvatar" alt="Cat Avatar" class="rounded-full w-full h-full object-cover">
          </div>
          <h3 class="text-2xl font-semibold text-amber-900">{{ cat.name }}</h3>
          <hr class="mb-4"/>
          <p class="text-sm text-gray-600 mb-2">Date of Birth: <span class="text-amber-800">{{ formatDate(cat.birthday) }}</span></p>
          <p class="text-sm text-gray-600 mb-2">Age: 
            <span class="text-amber-800">
              {{ calculateAge(cat.birthday).years }} year(s) 
              {{ calculateAge(cat.birthday).months }} month(s)
            </span>
          </p>
          <p class="text-sm text-gray-600 mb-2">Weight: <span class="text-amber-800">{{ cat.weight }} kg</span></p>
          <p class="text-sm text-gray-600 mb-2">Health Condition:  <span class="text-amber-800">{{ cat.health_condition }}</span></p>

          <div class="flex space-x-4 mt-4">
          <button class="bg-amber-400 text-amber-800 px-4 py-2 rounded-full mt-4 hover:bg-amber-500" @click="populateEditForm(cat)">Edit</button>
          <button class="bg-amber-400 text-amber-800 px-4 py-2 rounded-full mt-4 hover:bg-amber-500" @click="deleteCat(cat.id)">Remove</button>
          </div>
        </div>
      </div>

      <!--Add cat layout-->
      <h3 class="text-xl font-semibold text-amber-800 mb-4">{{ isEditing ? 'Edit Cat' : 'Add a new cat' }}</h3>
      <form @submit.prevent="showConfirmation" class="bg-white p-6 rounded-lg shadow-md">
        <div class="form-group">
          <label for="name" class="text-amber-800 font-bold">Name:</label>
          <input type="text" id="name" v-model="newCat.name" class="input-field" required />
        </div>
        <div class="form-group">
          <label for="date_of_birth" class="text-amber-800 font-bold">Date of Birth:</label>
          <input type="date" v-model="newCat.birthday" :max="today" class="input-field" required />
        </div>
        <div class="form-group">
          <label for="weight" class="text-amber-800 font-bold">Weight (kg):</label>
          <input type="number" step="0.1" v-model="newCat.weight" class="input-field" required />
        </div>
        <div class="form-group md:col-span-2">
          <label for="health_condition" class="text-amber-800 font-bold">Health Condition:</label>
          <input type="text" v-model="newCat.health_condition" class="input-field" />
        </div>

        <!-- Button container with flexbox -->
        <div class="flex justify-between items-center mt-4">
          <button class="bg-red-300 text-amber-800 px-6 py-2 rounded-full hover:bg-red-400" type="submit">{{ isEditing ? 'Update Cat' : 'Add Cat' }}</button>
          
          <!-- Cancel Button for clearing the form -->
          <button v-if="isEditing" class="bg-gray-300 text-amber-800 px-6 py-2 rounded-full hover:bg-gray-400" @click="cancelEdit">
            Cancel
          </button>
            
          <!-- New Cancel Button for clearing the form, aligned to the right -->
          <button v-else class="bg-gray-300 text-amber-800 px-6 py-2 rounded-full hover:bg-gray-400 ml-auto" @click="clearForm">
            Clear Form
          </button>
        </div>
      </form>

      <!-- Confirmation Modal -->
      <Modal
        :visible="isModalVisible"
        title="Confirm Cat Information"
        message="Please review the cat's information before submitting."
        :cat="newCat"
        @confirm="confirmSubmission"
        @cancel="cancelSubmission"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import defaultAvatar from '@/assets/defaultAvatar.png';
import apiClient from '@/services/apiClient';
import Modal from '@/components/Modal.vue';

export default {
  components: {
    Modal
  },
  //retrieve data from backend with users' cat info
  data() {
    return {
      user: {
        name: '',
      },
      cats: [],
      newCat: {
        name: '',
        birthday: '',
        health_condition: '',
        avatar: '',
        isEditing: false, // Flag for edit mode
        editingCatId: null // Store ID of the cat being edited
      },
      today: new Date().toISOString().split('T')[0],//add today's date for birth date adding check
      defaultAvatar: defaultAvatar,
      isModalVisible: false,
    };
  },
  created() {
    this.fetchCats();
  },
  mounted() {
    // Fetch the current user when the component is mounted
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        // Call the API to get the user info
        const response = await apiClient.get('/api/user/');
        // Set the user name
        this.user.name = response.data.name;
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    //fetch the cats from the backend API
    async fetchCats() {
      try {
        // // Retrieve the token from localStorage
        // const token = localStorage.getItem('access_token');

        // if (!token) {
        //   throw new Error("No access token available");
        // }

        // Send the request with the Authorization header
        const response = await apiClient.get('/api/cats/'
        );

        // Update cats data if the request is successful
        this.cats = response.data;
      } catch (error) {
        console.error("Error fetching cats:", error);
        // Handle possible errors like token expiration, etc.
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized! Please log in again.");
          // Redirect to login page or handle the token refresh
        } else {
          console.error("An error occurred", error.message);
        }
      }
    },
    // Trigger the modal before submitting the form
    showConfirmation() {
      console.log("show confirmation is called");
      this.isModalVisible = true;
    },

    // Handle confirmation action in the modal
    async confirmSubmission() {
      this.isModalVisible = false;  // Hide the modal

      // Now proceed with adding/updating the cat
      await this.addCat();
    },

    // Handle cancellation action in the modal
    cancelSubmission() {
      this.isModalVisible = false;  // Just close the modal
    },
    
    async addCat() {
      // const token = localStorage.getItem('access_token');
      // if (!token) throw new Error("No access token available");
      let response;

      try {
        if (this.isEditing) {
          console.log("currently updating cat id: ", this.editingCatId);
          response = await apiClient.put(`/api/cats/${this.editingCatId}/`, this.newCat);
          const updatedCatIndex = this.cats.findIndex(cat => cat.id === this.editingCatId);
          if (updatedCatIndex !== -1) this.cats[updatedCatIndex] = response.data;
          this.isEditing = false;
          this.editingCatId = null;
        } else {
          const response = await apiClient.post('/api/cats/', this.newCat);
          this.cats.push(response.data);
        }
        this.newCat = { name: '', birthday: '', health_condition: '', avatar: '' };
      } catch (error) {
        console.error("Error saving cat:", error);
      }
    },
    populateEditForm(cat) {
      // Populate the form with the selected cat's data
      this.newCat = { ...cat };
      this.isEditing = true; // Set the editing mode
      this.editingCatId = cat.id; // Track which cat is being edited
      // console.log("current editing cat id is ", this.editingCatId);
    },
    cancelEdit() {
      this.isEditing = false;
      this.editingCatId = null;
      this.newCat = { name: '', date_of_birth: '', health_condition: '', avatar: '' };
    },
    async deleteCat(catId) {
      // Ask the user for confirmation
      const isConfirmed = window.confirm("Are you sure you want to delete this cat?");
      if (!isConfirmed) return;

      try {
        // Send DELETE request to the backend
        await apiClient.delete(`/api/cats/${catId}/`);

        // Update local cats array by removing the deleted cat
        this.cats = this.cats.filter(cat => cat.id !== catId);
        console.log(`Cat with id ${catId} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting cat:", error);
      }
    },
    calculateAge(dob) {
      //This is already done in backend!! just need to post name, birthday, weight, health_condition(optional)
      //for details, see README.md in backend code
      const birthDate = new Date(dob);
      const today = new Date();
      
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      if (today.getDate() < birthDate.getDate()) {
        months--;
        if (months < 0) {
          years--;
          months = 11;
        }
      }
      return {years, months};
    },
    categorizeAge(dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();

      return ageInMonths < 12 ? 'Young' : 'Adult';
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    clearForm() {
      // Reset form fields to initial state
      this.newCat = {
        name: '',
        date_of_birth: '',
        weight: '',
        health_condition: ''
      };
    }
  }
};
</script>

<style>
@import '../../assets/ProfilePage.css';
</style>
