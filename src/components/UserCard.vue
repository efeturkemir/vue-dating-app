<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';



const store = useUserStore()
const props = defineProps<{
  image: string,
  name: string,
  id: string,
  age: number
}>()


</script>

<template>
  <div class="tinder">

    <div class="pic"
      :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent), url(${image})` }">

    </div>
    <div class="btns">
      <img @click="store.rewind" src="../assets/rewind.png" />
      <img @click="store.skip" src="../assets/nope.png" />
      <img src="../assets/super-like.png" />
      <img @click="store.getNextUser" src="../assets/like.png" />

    </div>
    <div class="absolute top-2 left-3 text-3xl text-white font-bold p-2">{{ name }}, {{ age }}</div>
    
  </div>
</template>