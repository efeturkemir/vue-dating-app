<script setup lang="ts">
import Message from '@/components/Message.vue';
import { auth, db } from '@/firebase';
import { useUserStore } from '@/stores/UserStore';
import { query, collection, onSnapshot, doc, setDoc, where, getDocs, type DocumentData } from 'firebase/firestore';
import { onMounted, ref, } from 'vue';
import { useRoute } from 'vue-router';


const store = useUserStore()
const route = useRoute()
let selectedChat = ref<DocumentData | null>(null)
let friend = ref<any>(null)
let newMessage = ref('')
let messages = ref<any>([])
const sendMessage = async () => {
  try {
    if (newMessage.value !== '') {
      const message = {
        text: newMessage.value,
        sender: auth.currentUser?.uid,
        timestamp: new Date()
      }
      const chatRef = doc(collection(db, 'chats'), `${route.params.chatId}`);
      await setDoc(chatRef, { messages: [...messages.value, message] }, { merge: true });
    }
    newMessage.value = ''; // Clear the input field
  } catch (error) {
    console.log(error);

  }
  console.log(auth.currentUser?.uid);

}

onMounted(async () => {
  const chatId = route.params.chatId;

  const chatsCollectionRef = collection(db, 'chats');
  store.loading = true;
  const q = query(chatsCollectionRef, where('chatId', '==', chatId));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    selectedChat.value = querySnapshot.docs[0].data();
  } else {
    // Handle case when no chat is found
    // You could redirect to an error page or display a message, etc.
  }
  const friendId = await selectedChat.value?.members.find((element: any) => element !== auth.currentUser?.uid)




  const friendQuery = query(
    collection(db, "users"),
    where("userId", "==", friendId)
  );
  const friendSnapshot = await getDocs(friendQuery)
  if (!friendSnapshot.empty) {
    friend.value = friendSnapshot.docs[0].data()
  }

  const chatRef = doc(collection(db, 'chats'), `${route.params.chatId}`);
  onSnapshot(chatRef, (snapshot) => {
    messages.value = [];
    snapshot.data()?.messages.forEach((message: any) => {
      messages.value.push(message);
    });
  });

  store.loading = false

});




</script>

<template>
  <!-- component -->
  <div v-if="selectedChat && friend" class="chat-container">
    <div class="flex items-center justify-start gap-2 py-3 fixed top-0 left-0 w-full bg-white z-10 ">
      <RouterLink to="/chat"><svg class="w-6 h-6 ml-2" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
      <path
        d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-4.828 11.5l4.608 3.763-.679.737-6.101-5 6.112-5 .666.753-4.604 3.747h11.826v1h-11.828z" />
    </svg>
  </RouterLink>
      <img v-if="friend.userImage" class="w-12 h-12 rounded-full object-contain" :src="friend.userImage" alt="User Avatar">
      <h1 class="ml-1 text-lg font-semibold">{{ friend.username }}</h1>
    </div>

    <div class="bg-white rounded-lg p-4">
      <!-- Conversation section -->
      <div class="mb-4 pt-[60px]">
        <div v-for="message in messages" :class="message.sender === auth.currentUser?.uid ? 'message-sent' : ''"
          class="flex items-start">
          <Message :text="message.text" :sender-i-d="message.sender" :image="friend.userImage" />
        </div>
      </div>




      <!-- Add more conversation items here -->

      <!-- Input section -->
      <form @submit.prevent="sendMessage" class="fixed bottom-0 left-0 right-0 py-1 px-8  bg-gray-300 flex mt-4">
        <input type="text" v-model="newMessage" placeholder="Type your message..."
          class="flex-grow rounded-l-lg p-2 outline-none">
        <button type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 rounded-r-lg">Send</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
}
  .icon {
    height: 24px;
    width: 24px;
  }
.message-sent {
  justify-content: flex-end;
}</style>