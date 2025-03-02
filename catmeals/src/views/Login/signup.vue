<template>
    <div class="bg-amber-50 text-amber-800 min-h-screen p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-center">
          <div class="w-full md:w-1/2">
            <h1 class="text-6xl font-bold mb-6 text-center">
              <span class="text-amber-800">Sign Up</span>
              <span class="text-red-400"> for MeowMeals</span>
            </h1>
  
            <!-- Signup Form -->
            <section class="signup-section">
              <div class="wrapper">
                <div class="account-box">
                  <div class="form">
                    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="60px" status-icon>
                      <el-form-item prop="username" label="Username">
                        <el-input v-model="form.username" />
                      </el-form-item>
                      <el-form-item prop="email" label="Email">
                        <el-input v-model="form.email" />
                      </el-form-item>
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
                      <el-form-item prop="confirmPassword" label="Confirm Password">
                        <el-input v-model="form.confirmPassword" type="password" />
                      </el-form-item>
                      <el-form-item label-width="22px">
                        <el-checkbox v-model="form.agree"  size="large">
                          agree to the user agreement
                        </el-checkbox>
                      </el-form-item>
                      <el-button size="large" class="subBtn" @click="doSignup">Sign Up</el-button>
                    </el-form>
                  </div>
                </div>
              </div>
            </section>
  
            <!-- Links for login -->
            <div class="flex justify-between items-right mt-4">
              <button @click="cancelSignup" class="text-amber-800 hover:underline">Cancel</button>
              <router-link to="/login" class="text-amber-800 hover:underline">Already have an account? Log in</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  import apiClient from '@/services/apiClient';
  
  export default {
    setup() {
      const form = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree:false
      });
  
      const rules = {
        username: [{ required: true, message: 'Username is required', trigger: 'blur' }],
        email: [{ required: true, message: 'Email is required', trigger: 'blur' },
                { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' },
        { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: (rule, value, callback) => value === form.value.password ? callback() : callback(new Error('Passwords do not match')) }
        ],
        agree: [
            { required: true, message: 'You must agree to the user agreement', trigger: 'change' },
        ]
      };
  
      const formRef = ref(null);
      const router = useRouter();
      const passwordVisible = ref(false);
  
      // Toggle password visibility
      const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value;
      };

      const handleDRFErrors = (errors) => {
  // check error from backend
  if (errors.error) {
    ElMessage.error(errors.error);
    return;
  }

  // if no `error` key, handle errors for other fields
  for (const [field, errorMessages] of Object.entries(errors)) {
    if (Array.isArray(errorMessages)) {
      ElMessage.error(`${field}: ${errorMessages[0]}`);
      return;
    } else if (typeof errorMessages === 'string') {
      ElMessage.error(`${field}: ${errorMessages}`);
      return;
    }
  }

  ElMessage.error('An error occurred during signup. Please try again.');
};

      const doSignup = () => {
        formRef.value.validate(async (valid) => {
            if (!valid) {
              ElMessage.error('Please fill in all required fields correctly.');
              return;
            }
            if (!form.value.agree) {
            ElMessage.error('Please agree to the user agreement.');
            return;
          }
          // Clear any existing tokens to prevent interference with the sign-up flow
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

            try {
                // Send signup request to backend API
                const response = await apiClient.post('/api/signup/', {
                username: form.value.username,
                email: form.value.email,
                password: form.value.password
                });

                ElMessage.success('Successfully signed up! Redirecting to login...');

                // Redirect to login page after successful signup
                setTimeout(() => {
                router.push('/login');
                }, 1500);
            } catch (error) {
                if (error.response && error.response.data) {
                  handleDRFErrors(error.response.data);
                } else if(error.request) {
                  ElMessage.error('Network error. Please check your internet connection.');
                } else {
            ElMessage.error('Error occurred. Please try again');
            }
          }
        });
      };
      const cancelSignup = ()=>{
          router.replace({ path: '/'})//to homepage
      }
  
      return { form, rules, formRef, doSignup,  cancelSignup,passwordVisible, togglePasswordVisibility };
    }
  };
  </script>