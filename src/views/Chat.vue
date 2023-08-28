<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import { useUserStore } from '@/stores/UserStore';
import { RouterLink, onBeforeRouteUpdate } from 'vue-router';
import { onMounted, ref } from 'vue';

const store = useUserStore();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await Promise.all([store.getChatRooms(), store.getUsers()]);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoading.value = false;
  }
});

onBeforeRouteUpdate((to, from, next) => {
  // Call the getUsers function before updating the route
  store.getChatRooms()
  next();
});

</script>

<template>
  <section class="antialiased bg-gray-50 text-gray-600 min-h-screen p-4 mt-3">
    <div class="h-full">
      <!-- Card -->
      <div class="relative max-w-[340px] mx-auto bg-white shadow-lg rounded-lg">
        <!-- Card header -->

        <!-- Card body -->
        <div class="py-4 px-6" v-if="!isLoading">
          <h3 class="text-sm font-semibold uppercase text-gray-400 mb-2">Chats</h3>
          <!-- Chat list -->
          <div v-if="store.chatrooms?.length === 0">
            You don't have any chats yet. <RouterLink to="/" class="text-purple-500">Keep scrolling!</RouterLink>
          </div>
          <div class="divide-y divide-gray-200">
            <div v-for="chat in store.chatrooms" :key="chat.chatId">
              <RouterLink :to="`/chatrooms/${chat.chatId}`">
                <button class="w-full text-left px-3 rounded-lg py-3 hover:bg-gray-300 focus:outline-none focus-visible:bg-indigo-50">
                  <div class="flex items-center">
                    <img
                      class="rounded-full object-cover items-start flex-shrink-0 mr-4 transition-all duration-500"
                      :class="{
                        'w-12 h-12': store.getFriendName(chat)?.img !== undefined,
                        'w-48 h-48': store.getFriendName(chat)?.img === undefined
                      }"
                      :src="store.getFriendName(chat)?.img"
                    />
                    <div>
                      <h4 class="text-base font-semibold text-gray-900">
                        {{ store.getFriendName(chat)?.username }}
                      </h4>
                      <div v-if="store.getFriendName(chat)?.lastMsg" class="text-sm">
                        {{ store.getFriendName(chat)?.lastMsg.text }}
                      </div>
                      <div v-else class="text-sm">
                        Start your chat with {{ store.getFriendName(chat)?.username }}
                      </div>
                    </div>
                  </div>
                </button>
              </RouterLink>
            </div>
          </div>
        </div>
        <!-- Show loading message while fetching data -->
        <div v-else class="py-4 px-6 text-center">Loading...</div>
      </div>
    </div>
  </section>
  <Navbar></Navbar>
</template>

  
