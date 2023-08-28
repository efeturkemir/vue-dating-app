// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeh3VLlno5I4ZGvgUtHc19WULZ9jh1N-0",
  authDomain: "myapp-4e79c.firebaseapp.com",
  projectId: "myapp-4e79c",
  storageBucket: "myapp-4e79c.appspot.com",
  messagingSenderId: "1074978890008",
  appId: "1:1074978890008:web:07aea35183848d7a317e6d"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage()
export const auth = getAuth()


// Initialize Firebase

