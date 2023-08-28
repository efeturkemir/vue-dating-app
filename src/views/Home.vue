<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import { useUserStore } from '@/stores/UserStore';
import { computed,  onMounted } from 'vue';

import UserCard from '@/components/UserCard.vue';
import Matched from '@/components/Matched.vue';
const store = useUserStore()
onMounted(() => {
  store.getUsers()
  store.getCurrentUser()
})

const currentUser = computed(() => {
  return store.users[store.currentIndex]
})



</script>

<template>
 <div class="bg-gray-100">
  <Matched  :image="store.matchedUser.userImage" :name="store.matchedUser.username" v-if="store.matched"></Matched>
  <UserCard v-if="currentUser && currentUser.userImage" :key="currentUser.userId" :id="currentUser.userId" :age="currentUser.age"  :image="currentUser.userImage" :name="currentUser.username"></UserCard>

  <Navbar></Navbar>
</div>
</template>
