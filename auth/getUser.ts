import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";

const auth:Auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User ID:', user.uid);
    console.log('User Email:', user.email);
    console.log('User Display Name:', user.displayName);
    console.log('User Photo URL:', user.photoURL);
    console.log('Email Verified:', user.emailVerified);
  } else {
    window.location.href = "/login";    
  }
});