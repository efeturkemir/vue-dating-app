<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Crop from "./Crop.vue"
import Navbar from '../components/Navbar.vue'
import { auth, db, storage } from '@/firebase';
import { signOut, updateProfile, type User } from 'firebase/auth';
import router from '@/router';
import { useUserStore } from '@/stores/UserStore';
import { doc, updateDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { ref as fbRef, uploadString, getDownloadURL } from "firebase/storage";

let showModal = ref<Boolean>(false)
let image = ref<any>(null)
let bio = ref('')
let gender = ref('')
const store = useUserStore()
const storageRef = fbRef(storage, `images/${auth.currentUser?.uid}`);
onMounted(() => {
  store.getCurrentUser()


})

const updateUser = async () => {
  try {
    store.loading = true
    const q = query(
      collection(db, "users"),
      where("userId", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {

      const docRef = querySnapshot.docs[0].ref
      if (bio.value)
        await updateDoc(docRef, { bio: bio.value })
      if (image.value) {
        const snapshot = await uploadString(storageRef, image.value, 'data_url')
        const imageUrl = await getDownloadURL(snapshot.ref)
        await updateDoc(docRef, {
          userImage: imageUrl
        })
      }
      if(gender.value){
        await updateDoc(docRef, {gender: gender.value})
      }

    }
    store.loading = false
  } catch (error) {

  }

}



const setCroppedImageData = (data: any) => {
  image.value = data.imageUrl
  showModal.value = false
}
const logout = async () => {
  signOut(auth).then(() => {
    router.push("/login")
  }).catch((error) => {
    console.log(error)

  })
}


</script>
<template>
  <div v-if="store.loggedInUser !== null && store.loading == false" class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-3">Edit Profile</h1>

    <form @submit.prevent="updateUser" class="max-w-md w-full px-4 bg-white rounded-lg shadow-lg py-6">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
        <input :value="store.loggedInUser.username"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username" type="text" placeholder="Username">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="bio">Bio</label>
        <input v-model="bio"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="bio" type="text" placeholder="Write a bio">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="interests">Interests</label>
        <select
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="interests">
          <option value="sports">Sports</option>
          <option value="gaming">Gaming</option>
          <option value="music">Music</option>
          <!-- Add more options here -->
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="gender-preference">Gender Preference</label>
        <select v-model="gender"
          class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="gender-preference">
          <option selected disabled>Pick a gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <Crop v-if="showModal" @showModal="showModal = false" @CroppedImageData="setCroppedImageData"></Crop>

      <div class="mt-5">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="profile-image">Profile Image</label>
        <button @click="showModal = !showModal" class="bg-green-500 py-2 px-3 rounded text-white" type="button">Upload
          Image</button>
      </div>
      <h1 v-show="store.loggedInUser.userImage">Uploaded Image</h1>
      <img v-if="image" class="object-cover" :src=image alt="">
      <img v-else class="object-cover" :src="store.loggedInUser.userImage" alt="">
      <div class="flex justify-center gap-5 pb-[45px]">
        <button
          class="bg-purple-500 hover:bg-purple-700 text-white font-bold mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">Save Changes</button>
        <button @click="logout"
          class="bg-red-500 hover:bg-red-700 text-white font-bold mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button">Logout</button>
      </div>

    </form>

  </div>  
  <Navbar></Navbar>
</template>