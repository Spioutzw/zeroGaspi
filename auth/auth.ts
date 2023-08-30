
import { auth} from "../database/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import * as firebase from "firebase/auth";
import { useRouter } from "expo-router";

const navigation = useRouter();

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Dispatch, SetStateAction } from "react";
import { FirebaseError } from "firebase/app";

GoogleSignin.configure({
  webClientId:"743847777990-ik2ihvpj930eglsri9b9setvarjhrpu9.apps.googleusercontent.com"
});



let isSignInInProgress = false;  // Declare a global or higher-scope variable

const signInWithGoogle = async (): Promise<void> => {
  if (isSignInInProgress) {
    console.log("[Error: Sign-in in progress]");
    return;
  }

  try {
    console.log(auth)
    isSignInInProgress = true;  // Lock
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const {idToken} = userInfo
    console.log(idToken)
    const credential = firebase.GoogleAuthProvider.credential(idToken);
    await firebase.signInWithCredential(auth,credential);
    console.log(userInfo);
  } catch (error: any) { // Utilisation de any ici car le type d'erreur est inconnu
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log(error);
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(error);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(error);
    } else {
      console.log(error,'errorMessage');
    }
  } finally {
    isSignInInProgress = false;  // Unlock
  }
};

const signIn = async(email:string,password:string,setError:Dispatch<SetStateAction<string|null>>):Promise<void> => {

  try {
    await signInWithEmailAndPassword(auth,email,password);
    navigation.push('/(tabs)/home');
  } catch (error: any) {
    const firebaseError = error as FirebaseError
   if (firebaseError.code === 'auth/invalid-email') {
    setError('Invalide email');
  } else if (firebaseError.code === 'auth/invalid-password') {
    setError('Mot de Passe incorrect');
  } else if (firebaseError.code === 'auth/too-many-requests') {
    setError("Veuillez attendre quelques instants");
  }
  else {
    setError(firebaseError.message);
  }

}}

const signUp = async(email:string,password:string,setError:Dispatch<SetStateAction<string|null>>):Promise<void> => {

  try {
    await createUserWithEmailAndPassword(auth,email,password);
    navigation.push('/(tabs)/home');
  } catch (error: any) {
    const firebaseError = error as FirebaseError
    if(firebaseError.code === 'auth/email-already-in-use') {
      setError('Cette adresse email existe déjà');
    }
    else {
      setError(firebaseError.message);
    }
    
  }
}


const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};



export { signOut,signInWithGoogle,signIn,signUp,};
