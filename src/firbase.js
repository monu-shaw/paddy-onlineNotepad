import {initializeApp} from "firebase/app"
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxfJmlibFhhahfypd07Z1HZoW8PwKWWy4",
  authDomain: "paddy-1cdf5.firebaseapp.com",
  databaseURL: "https://paddy-1cdf5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "paddy-1cdf5",
  storageBucket: "paddy-1cdf5.appspot.com",
  messagingSenderId: "449518645598",
  appId: "1:449518645598:web:056c2407ca174d2966dfcf",
  measurementId: "G-403GKXHDF9"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);
  
  const db = getFirestore(app);
  export default db;
