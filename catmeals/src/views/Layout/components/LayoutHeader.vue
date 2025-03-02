<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const confirm =() =>{
  console.log("logging out")
  userStore.clearUserInfo()
  router.push('/login')
}
</script>

<template>
  <header class="bg-amber-50 text-amber-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <img src="@/assets/mmlogo.png" alt="MeowMeals Logo" class="h-20" />
          
          <!-- Main Navigation -->
          <nav>
            <ul class="flex space-x-6">
              <li>
                <RouterLink to="/" class="hover:text-red-400">Home</RouterLink>
              </li>
              <li>
                <RouterLink to="/recipe" class="hover:text-red-400">Recipe</RouterLink>
              </li>
            </ul>
          </nav>
        </div>
        
        <!-- User Navigation -->
        <nav>
          <ul class="flex space-x-4">
            <template v-if="userStore.userInfo.token">
              <li>
                <!-- Dashboard Button -->
                <RouterLink to="dashboard" class="hover:text-red-400">
                  Dashboard
                </RouterLink>
              </li>
              <li>
                <a href="javascript:;" class="text-amber-800 hover:text-red-400">
                  <i class="iconfont icon-user mr-1"></i>{{userStore.userInfo.user.username}}
                </a>
              </li>
              <li>
                <el-popconfirm
                  title="Log out?"
                  confirm-button-text="Yes"
                  cancel-button-text="No"
                  @confirm="confirm"
                  trigger="click"
                >
                  <template #reference>
                    <a href="javascript:;" class="text-amber-800 hover:text-red-400">LOG OUT</a>
                  </template>
                </el-popconfirm>
              </li>
            </template>
            <template v-else>
              <li>
                <a href="javascript:;" class="text-amber-800 hover:text-red-400" @click="$router.push('/login')">Log in/Sign up</a>
              </li>
            </template>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>