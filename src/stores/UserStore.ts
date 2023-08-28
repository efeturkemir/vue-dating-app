import { defineStore } from "pinia";
import { db } from "@/firebase";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  type DocumentData,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref } from "vue";
import { auth } from "@/firebase";
import type User from "@/types/User";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: ref<any>([]),
    currentIndex: ref(0),
    loading: ref(false),
    loggedInUser: ref<DocumentData | null>(null),
    chatrooms: ref<ChatRoom[]>([]),
    matched: ref(false),
    matchedUser: ref(),
    selectedChat: ref(),
    error: ref<Boolean>(false),
    errorMsg: ref<string>(""),
  }),
  actions: {
    async  getUsers() {
      try {
        this.loading = true;
    
        await this.getCurrentUser();
    
        const id = auth.currentUser?.uid;
        const colRef = collection(db, "users");
        const querySnapshot = query(colRef, where("userId", "!=", id));
        const docsSnap = await getDocs(querySnapshot);
        
    
        const newUsers : User[] = [];
    
        docsSnap.forEach((doc) => {
          const docData = doc.data();
          if (docData.gender !== this.loggedInUser?.gender) {
            newUsers.push(docData as User);
          }
        });
 
        this.users = newUsers;
    
        this.loading = false;
      } catch (error) {
 
        console.error("Error while fetching users:", error);
      }
    }
    ,
    async handleError(msg: string) {
      switch (msg) {
        case "auth/invalid-password":
          this.errorMsg = "Password should be atleast 6 characters";
          break;
        case "auth/invalid-email":
          this.errorMsg = "Invalid Email";
          break;
        case "auth/internal-error":
          this.errorMsg = "Server error";
          break;
        case "auth/email-already-exists":
          this.errorMsg =
            "This email already exist, please enter different email";
          break;
        case "auth/user-not-found":
          this.errorMsg = "Wrong username or password";
          break;
        default:
          this.errorMsg = "Unknown Error, please try again";
          break;
      }
    },
    async rewind() {
      this.loading = true;
      if (this.currentIndex !== 0) {
        this.currentIndex = (this.currentIndex - 1) % this.users.length;
      }
      this.loading = false;
    },
    async match(currentId: string | undefined, matchedId: string) {
      this.matchedUser = await this.users.find(
        (element: any) => element.userId === matchedId
      );
      this.matched = true;

      
    
      this.createChatroom(currentId, matchedId);
    },
    async createChatroom(user1Id: string | undefined, user2Id: string) {
      const docRef = await addDoc(collection(db, "chats"), {
        members: [user1Id, user2Id],
        messages: [],
      });
      const chatId = docRef.id; // Retrieve the generated document ID

      // Update the document with the ChatId
      await updateDoc(doc(db, "chats", chatId), {
        chatId: chatId,
      });
    },
    async getChatRooms() {
      this.loading = true;
    
      try {
        const chatsRef = collection(db, "chats");
        const q = query(
          chatsRef,
          where("members", "array-contains", auth.currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
    
        const newChatrooms: ChatRoom[] = querySnapshot.docs
          .map((doc) => doc.data() as ChatRoom)
          .filter((chatroom) => !this.chatrooms.some((cr) => cr.chatId === chatroom.chatId));
    
        this.chatrooms = [...this.chatrooms, ...newChatrooms];
      } catch (error) {
        console.log("Error getting chats:", error);
      } finally {
        this.loading = false;
      }
    },
    
getFriendName(chatRoom: any) {
      const friendId = chatRoom.members.find(
        (id: any) => id !== auth.currentUser?.uid
      );
 
      
      const lastMessage = chatRoom.messages[chatRoom.messages.length - 1];

      const friend = this.users.find(
        (element: any) => element.userId === friendId
      );

      if (friend) {
        return {
          username: friend.username,
          img: friend.userImage,
          lastMsg: lastMessage,
        };
      }
    },
    async checkChatExists(userId1: string | undefined, userId2: string) {
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("members", "array-contains", userId1));

      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map((doc) => doc.data());

      // Check if a chat exists with both user IDs
      const existingChat = chats.find((chat) => chat.members.includes(userId2));

      return !!existingChat; // Return true if an existing chat is found, false otherwise
    },

    async getNextUser() {
      this.loading = true;
      const q = query(
        collection(db, "users"),
        where("userId", "==", this.users[this.currentIndex].userId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        const id = document.id;
        const userRef = doc(db, "users", id);
        const userData = document.data();

        if (
          this.loggedInUser?.likes.includes(userData.userId) &&
          !(await this.checkChatExists(auth.currentUser?.uid, userData.userId))
        ) {
          await this.match(auth.currentUser?.uid, userData.userId);
        } else {
          await updateDoc(userRef, {
            likes: arrayUnion(`${auth.currentUser?.uid}`),
          });
        }
      });

      this.currentIndex = (this.currentIndex + 1) % this.users.length;
      this.loading = false;
    },
    async skip() {
      this.loading = true;
      this.currentIndex = (this.currentIndex + 1) % this.users.length;
      this.loading = false;
    },
    async getCurrentUser() {
      try {
        const q = query(
          collection(db, "users"),
          where("userId", "==", auth.currentUser?.uid)
        );
    
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.docs.length === 0) {
          // Handle case where no user document is found
          this.loggedInUser = null;
        } else {
          this.loggedInUser = querySnapshot.docs[0].data();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
 
    
  },
});
