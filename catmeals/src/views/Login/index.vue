<template>
    <div class="bg-amber-50 text-amber-800 min-h-screen p-8">
      <!-- Header and Navigation -->
      <!-- <LayoutHeader />
      <LayoutNav /> -->
  
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-center">
          <div class="w-full md:w-1/2">
            <h1 class="text-6xl font-bold mb-6 text-center">
              <span class="text-amber-800">Login</span>
              <span class="text-red-400"> to MeowMeals</span>
            </h1>

            <!-- NEW Login Form -->
            <section class="login-section">
              <div class="wrapper">
                <!-- <nav>
                  <a href=" ">Login</a >
                </nav> -->
                <div class="account-box">
                  <div class="form">
                    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="60px"
                      status-icon>
                      <el-form-item prop="username" label="username">
                        <el-input v-model="form.username"/>
                      </el-form-item>
                      <!-- Password Input with Toggle Button -->
                      <el-form-item prop="password" label="Password">
                        <el-input
                          v-model="form.password"
                          :type="passwordVisible ? 'text' : 'password'"  
                          placeholder="Enter your password"
                        />
                        <el-button @click="togglePasswordVisibility" type="text">
                          {{ passwordVisible ? 'Hide Password' : 'Show Password' }}  <!-- Toggle button label -->
                        </el-button>
                      </el-form-item>
                      <el-button size="large" class="subBtn" @click="doLogin">Click to Login</el-button>
                    </el-form>
                  </div>
                </div>
              </div>
            </section>
  
            <!-- Links for registration and cancellation -->
            <div class="flex justify-between items-center mt-4">
              <button @click="cancelLogin" class="text-amber-800 hover:underline">Cancel</button>
              <router-link to="/signup/" class="text-amber-800 hover:underline">Create a new account</router-link>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <!-- <LayoutFooter /> -->
    </div>
  </template>
  
  <script>
  import {ref} from 'vue'
  import {ElMessage} from 'element-plus'
  import {useRouter} from 'vue-router'
  import 'element-plus/es/components/message/style/css' 
  import {useUserStore} from '@/stores/user'

  export default {
    setup() {

      const form = ref({
      username:'',
      password:''
    })


    const rules ={
      username:[
        {required: true, message:'not null', trigger:'blur'}
      ],
      password:[
        {required: true, message:'not null', trigger:'blur'},
        {min:6, max:20, message:'6-20', trigger:'blur'}
      ]
    }
    const formRef = ref(null)
    const router = useRouter()
    const userStore = useUserStore()
    const passwordVisible = ref(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value;
      };

      const doLogin = () => {
  const { username, password } = form.value
  
  formRef.value.validate(async (valid) => {
    console.log(valid)
    
    if (valid) {
      if (!username || !password) {
        ElMessage.error('Please enter username and password');
        return;
      }

      try {
        await userStore.getUserInfo({ username, password })
        ElMessage({ type: 'success', message: 'success to login' })
        router.replace({ path: '/' }) //to homepage
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 400) {
            if (data.detail === 'User does not exist') {
              ElMessage.error("User does not exist. Please check the username.")
            } else if (data.detail === 'Wrong password') {
              ElMessage.error("Password is wrong.")
            } else {
              ElMessage.error(`login failed: ${data.detail || 'Please try again later'}`)
            }
          } else {
            ElMessage.error('Server error. Please try again later.')
          }
        } else if (error.request) {
          ElMessage.error('Network error.')
        } else {
          ElMessage.error('An error occurred during login, please try again')
        }
      }
    } else {
      ElMessage.error('Please fill in all the blanks.')
    }
  })
}
    const cancelLogin = ()=>{
      router.replace({ path: '/'})//to homepage
    }
  
    return { form, rules, formRef,doLogin,userStore, cancelLogin, passwordVisible, togglePasswordVisibility };
  }
};
  
</script>



<!-- 
<script>
import { errorMessages } from 'vue/compiler-sfc';
import apiClient from '@/services/apiClient';
//   import LayoutHeader from '@/components/Layout/LayoutHeader.vue';
//   import LayoutNav from '@/components/Layout/LayoutNav.vue';
//   import LayoutFooter from '@/components/Layout/LayoutFooter.vue';
  
  export default {
    // components: {
    //   LayoutHeader,
    //   LayoutNav,
    //   LayoutFooter,
    // },
    data() {
      return {
        loginData: {
          username: '',
          password: ''
        },
        errorMessage: '',
        csrfToken: ''
      };
    },
    mounted(){
        // Example: Check if user is already logged in based on access token in localStorage
        // const token = localStorage.getItem('access_token');
        // if (token) {
        // // If token exists, you can auto-redirect to the profile or another page
        // this.$router.push('/profile');
        // }

        // Fetch CSRF token if necessary (for some frameworks like Django)
        this.getCsrfToken();
    },
    methods: {
        async getCsrfToken() {
            try {
                const response = await apiClient.get('/api/csrf-token/');  // Make sure this matches the Django URL
                this.csrfToken = response.data.csrftoken;
                console.log('CSRF token fetched:', this.csrfToken);

                // Store the token in a cookie for later use
                document.cookie = `csrftoken=${this.csrfToken}; path=/`;
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        },
        loginUser() {
            if (!this.loginData.username || !this.loginData.password) {
                this.errorMessage = "Username and password are required.";
                return;
            }
            console.log('Login request being sent. User is '+ this.loginData);
            // Call backend API to log in user with regular credentials (via allauth)
            apiClient.get('/accounts/login/', this.loginData, {
                headers: {
                    'x-csrftoken': this.csrfToken
                },

                // withCredentials: true,
                // Include CSRF token if required
            }).then(response => {
                // On success, redirect to cat profile or another page
                console.log('Login successful', response);
                this.$router.push('/profile');
            }).catch(error => {
                // If login fails, show an error message to the user
                if (error.response && error.response.status === 400) {
                    this.errorMessage = 'Invalid username or password. Please try again.';
                } else {
                    this.errorMessage = 'An unexpected error occurred. Please try again later.';
                }
            });
        },
        loginWithGoogle() {
            // Redirect to Google OAuth URL
            window.location.href = '/accounts/google/login/';
        },
        cancelLogin() {
            // Redirect the user to the previous page
            this.$router.go(-1);
        }
        }
    }
    </script>
    <style scoped>
    .input-field {
        padding: 12px;
        margin: 0 0 12px;
        font-size: 16px;
    }
    </style> -->