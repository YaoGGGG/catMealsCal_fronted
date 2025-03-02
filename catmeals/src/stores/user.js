import { defineStore } from 'pinia'
import {loginAPI} from '@/apis/user'
import {tokenAPI} from '@/apis/token'
import {ref, computed} from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({})
  const accessToken = ref('')
  const refreshToken = ref('')
  
  const getUserInfo = async ({ username, password }) => {
      try {
          // login with logs
          const loginResponse = await loginAPI({ username, password })
          console.log("Login API Response:", loginResponse)
          userInfo.value = loginResponse.data
          
          // catch token
          const tokenResponse = await tokenAPI({ username, password })
          console.log("Token API Response:", tokenResponse)
          
          // store token
          accessToken.value = tokenResponse.data.access
          refreshToken.value = tokenResponse.data.refresh
          userInfo.value.token = accessToken
          
          localStorage.setItem('access_token', accessToken.value)
          localStorage.setItem('refresh_token', refreshToken.value)
          
          return loginResponse // return logs to frontend
          
      } catch (error) {
          console.error('Error in getUserInfo:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
          })
          // show the original error msgs
          throw error
      }
  }

  const clearUserInfo = () => {
      userInfo.value = {}
      accessToken.value = ''
      refreshToken.value = ''
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
  }

  return { 
      userInfo, 
      getUserInfo, 
      clearUserInfo,
    
      token: computed(() => accessToken.value)
  }
}, {
  persist: true,
})
