<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';

const props = defineProps<{
    image: string
    name: string,

}>()
const store = useUserStore()
</script>
<template>
    <div class="relative z-10">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition opacity"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto mt-6">
            <div class="flex min-h-full items-end justify-center p-4 items-center py-2">

                <div class="max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h1 class="text-3xl font-bold text-center text-crimson">Matched!</h1>
                    <div class="flex items-center justify-center mt-6">
                        <img class="w-32 h-32 rounded-full" :src=image alt="Matched user">
                    </div>
                    <h2 class="mt-4 text-lg font-semibold text-center">{{ name }}</h2>
                    <p class="mt-2 text-center text-gray-500">Congratulations! You both liked each other.</p>
                    <div class="flex items-center justify-center mt-6">
                        <RouterLink  to="/chat"><button @click="store.matched = false" class="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600">Send a
                            message!</button></RouterLink>
                    </div>
                    <div class="flex items-center justify-center mt-4">
                        <a @click="store.matched = false" class="text-purple-500 cursor-pointer">Keep swiping</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>