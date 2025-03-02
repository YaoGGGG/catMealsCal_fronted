import axios from 'axios'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/stores/user'

const httpInstance = axios.create({
  // baseURL: 'http://192.168.1.68:8000/',
  baseURL: 'http://localhost:8000/',
  timeout: 5000
})

httpInstance.interceptors.request.use(async (config)=> {
    const userStore = useUserStore()

    console.log("--------http.js----")

    const token = userStore.userInfo.token
    // console.log('Token in http.js:', token);
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log("--------http.js----")
    return config
  }, (error)=> {
    return Promise.reject(error)
})


httpInstance.interceptors.response.use((response)=> {
    return response
  }, (error)=> {
    return Promise.reject(error)
})
// httpInstance.interceptors.response.use(res => res.data, error => {
//     ElMessage({
//       type:'warning',
//     //   message: error.response.data.message,
//   })
//     return Promise.reject(error)
// })

export default httpInstance 