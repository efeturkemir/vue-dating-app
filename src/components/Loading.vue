<script setup lang="ts" >
import { useUserStore } from '@/stores/UserStore';

const store = useUserStore()

</script>
<template>
    <div v-if="store.loading" class="flex min-h-screen items-center justify-center space-x-2">
        <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
        <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
        <div class="w-4 h-4 rounded-full animate-pulse dark:bg-violet-400"></div>
    </div>
</template>