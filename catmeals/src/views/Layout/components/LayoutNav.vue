<!-- don't use this anymore, it combined with the header. -->
<script setup>

</script>

<template>
  <nav class="bg-amber-100 py-2">
    <div class="container mx-auto px-4">
      <ul class="flex justify-end space-x-4">
        <template v-if="true">
          <li>
            <a href="javascript:;" class="text-amber-600 hover:text-amber-800">
              <i class="iconfont icon-user mr-1"></i>Default User
            </a>
          </li>
          <li>
            <el-popconfirm
              title="Log out?"
              confirm-button-text="Yes"
              cancel-button-text="No"
            >
              <template #reference>
                <a href="javascript:;" class="text-amber-600 hover:text-amber-800">LOG OUT</a>
              </template>
            </el-popconfirm>
          </li>
        </template>
        <template v-else>
          <li>
            <a href="javascript:;" class="text-amber-600 hover:text-amber-800">Log in</a>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>