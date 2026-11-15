import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDH_BGnZQrv7GJNZB57QDb_cnG0lb-yfPQ",
  authDomain: "blog-app-6ed07.firebaseapp.com",
  projectId: "blog-app-6ed07",
  storageBucket: "blog-app-6ed07.firebasestorage.app",
  messagingSenderId: "748943323058",
  appId: "1:748943323058:web:11fc6f4dc2766e19bd7eab",
  measurementId: "G-NGWNNMSEGC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };