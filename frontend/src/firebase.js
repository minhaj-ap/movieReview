import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBu8x5bcRJCPX5h5k-mpKbAcNWrf8Cr-kw",
  authDomain: "entri-projects.firebaseapp.com",
  projectId: "entri-projects",
  storageBucket: "entri-projects.appspot.com",
  messagingSenderId: "146870101469",
  appId: "1:146870101469:web:15034b63885887eecbc234",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
