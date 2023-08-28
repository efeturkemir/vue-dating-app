<script setup lang="ts">
import { auth } from '@/firebase';


// defineProps, sender ID, text,
// senderID === auth.id ? :class 'message-sent' 

const props = defineProps<{
  image: string,
  senderID: string,
  text: string,
 
}>()

</script>
<template>
  <div class="mb-4">
        <div :class="senderID === auth.currentUser?.uid ? 'justify-content: flex-end' : ''" class="flex items-start">
          <img v-if="senderID !== auth.currentUser?.uid" class="w-10 h-10 rounded-full object-cover" :src="image" alt="User Avatar">
          <div :class="senderID === auth.currentUser?.uid ? 'bg-green-300' : 'bg-blue-300'" class="ml-2 p-3 rounded-lg">
            <p class="text-sm">{{text}}</p>
            <span class="text-xs text-gray-500">{{}}</span>
          </div>
        </div>
      </div>

</template>
<style scoped>

.message-sent {
  justify-content: flex-end;
}
</style>