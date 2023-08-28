<script setup lang="ts">
import { auth } from '@/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { RouterLink } from 'vue-router';
import router from '@/router';
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import Error from '@/components/Error.vue';
let email = ref('')
let password = ref('')

const store = useUserStore()
const login = async () => {
    if(!store.error){
    store.loading = true
    try {

        const { user } = await signInWithEmailAndPassword(auth, email.value, password.value)
        await store.getUsers()
        router.push("/")

    } catch (error) {


        store.error = true
        console.log(error);

        store.handleError((error as any).code);


    }
    store.loading = false
}
}

</script>

<template>
    <div v-if="store.loading == false" class="flex flex-col items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
            <div>
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900 text-center">
                    Login to your account
                </h2>
                <p class="mt-2 text-sm text-gray-600 text-center">
                    Dont have an account?
                    <RouterLink to="/register" class="font-medium text-purple-600 hover:text-purple-500">
                        Sign up
                    </RouterLink>
                </p>
            </div>
            <div class="bg-white mt-8 py-8 px-4 shadow-md rounded-lg">
                <form @submit.prevent="login" class="space-y-6">

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div class="mt-1">
                            <input id="email" name="email" v-model="email" type="email" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                        </div>
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div class="mt-1">
                            <input id="password" v-model="password" name="password" type="password" required
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg class="h-5 w-5 text-purple-500 group-hover:text-purple-400"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M3.293 7.293a1 1 0 0 1 1.414 0L10 12.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </span>
                            Login
                        </button>

                    </div>
                </form>
            </div>
        </div>
    </div>
    <Error :text="store.errorMsg"></Error>
</template>