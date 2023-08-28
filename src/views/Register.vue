<script setup lang="ts">
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref as fbRef, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import Crop from "./Crop.vue"
import { db, storage } from '@/firebase.js'
import { RouterLink } from 'vue-router';
import router from '@/router';
import { useUserStore } from '@/stores/UserStore';

let username = ref("")
let email = ref("")
let password = ref("")
let confirmPassword = ref("")
let selectedGender = ref("")
let showModal = ref(false)
let image = ref<any>(null)
let age = ref(18)

const store = useUserStore()

const setCroppedImageData = (data: any) => {
  image.value = data.imageUrl
  showModal.value = false
}

const register = async () => {
  store.loading = true
    
  
  try {
    if (password.value === confirmPassword.value) {
    
    const auth = getAuth()
    const { user } = await createUserWithEmailAndPassword(auth, email.value, password.value)

    const docRef = await addDoc(collection(db, 'users'), {
      username: username.value,
      email: email.value,
      gender: selectedGender.value,
      age: age.value,
      userId: user.uid,
      likes: []

    })
    const storageRef = fbRef(storage, `images/${user.uid}`);
    if (image.value) {
      const snapshot = await uploadString(storageRef, image.value, 'data_url')
      console.log('Uploaded a data_url string!', snapshot)

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(snapshot.ref)

      // Update the user document with the image URL
      await updateDoc(docRef, {
        userImage: imageUrl
      })

      console.log('Image URL saved in the user document:', imageUrl)
    }

    console.log('Document written with ID:', docRef.id)
    store.loading = false
    router.push("/")
  }else{
    store.loading = false
    store.error = true
    store.errorMsg = "Passwords do not match!"
  }} catch (error) {
    console.error('Error adding document:', error)
  }
}



</script>

<template>
  
  <div v-if="store.loading == false" class="flex flex-col items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 text-center">
          Create an Account
        </h2>
        <p class="mt-2 text-sm text-gray-600 text-center">
          Already have an account?
          <RouterLink to="/login" href="#" class="font-medium text-purple-600 hover:text-purple-500">
            Sign in
          </RouterLink>
        </p>
      </div>
      <div class="bg-white mt-8 py-8 px-4 shadow-md rounded-lg">
        <form @submit.prevent="register" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1">
              <input id="name" v-model="username" name="name" type="text" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" required
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
            <label for="password" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div class="mt-1">
              <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700">
              Age
            </label>
            <div class="mt-1">
              <input id="age" v-model="age" name="age" type="number" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div class="mt-1">
              <select id="gender" v-model="selectedGender" name="gender" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                <option value="" disabled selected>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <Crop v-if="showModal" @showModal="showModal = false" @CroppedImageData="setCroppedImageData"></Crop>
            <div class="mb-5">
              <label class="block text-gray-700 text-sm font-bold mb-2 mt-2" for="profile-image">Profile Image</label>
              <button @click="showModal = !showModal" class="bg-blue-600 py-2 px-3 rounded text-white"
                type="button">Upload Image</button>
            </div>
            <h1 v-if="image">Uploaded Image</h1>
            <img class="object-cover" :src="image" alt="">
          </div>
          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-purple-500 group-hover:text-purple-400" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M3.293 7.293a1 1 0 0 1 1.414 0L10 12.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>