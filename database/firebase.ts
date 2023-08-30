// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyCrSlnzgrs49bc2Al6EcibrX1hFv4-y35I",

  authDomain: "zerogaspi-fa710.firebaseapp.com",

  projectId: "zerogaspi-fa710",

  storageBucket: "zerogaspi-fa710.appspot.com",

  messagingSenderId: "743847777990",

  appId: "1:743847777990:web:74511e755115eec007a9c7"

};


// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db:Firestore = getFirestore(app);

export { auth, db,app };
