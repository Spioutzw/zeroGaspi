import { db,auth } from "../app/(tabs)/_layout";
import { set, ref,get } from "firebase/database";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  
} from "firebase/auth";
import * as firebase from "firebase/auth";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

const navigation = useRouter();

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Dispatch, SetStateAction } from "react";
import { FirebaseError } from "firebase/app";
import  Constants from "expo-constants";
import { Alert } from "react-native";

GoogleSignin.configure({
  webClientId:
    "743847777990-ik2ihvpj930eglsri9b9setvarjhrpu9.apps.googleusercontent.com",
});

const router = useRouter();

const getExpoPushToken = () => {
  return new Promise<string | null>((resolve, reject) => {
    Alert.alert(
      'Notifications de Produits Périmés',
      'Souhaitez-vous être averti lorsque vos produits sont périmés?',
      [
        {
          text: 'Non, merci',
          onPress: () => {
            console.log('Permission refusée');
            resolve(null);
          },
          style: 'cancel',
        },
        {
          text: 'Oui, bien sûr',
          onPress: async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
              // Récupérez et stockez le token Expo ici
              const token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId
              });
              resolve(token.data);
            } else {
              console.log('Permission pour les notifications refusée');
              resolve(null);
            }
          },
        },
      ],
      { cancelable: false }
    );
  });
};


let isSignInInProgress = false; // Declare a global or higher-scope variable

const signInWithGoogle = async (): Promise<void> => {

  if (isSignInInProgress) {
    console.log("[Error: Sign-in in progress]");
    return;
  }

  try {
    isSignInInProgress = true; // Lock
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    const userId = userInfo.user.id;
    const userRef = ref(db, 'users/' + userId);
    get(userRef).then( async(snapshot) => {
      if (!snapshot.exists()) {
        
        const expoPushToken = await getExpoPushToken();
        if (userInfo.user) {
          if (expoPushToken) {
            set(ref(db, "users/" + userId), {
              ...userInfo.user,
              expoPushToken
            });
          } else {
            set(ref(db, "users/" + userId), {
              ...userInfo.user,
            });
          }
        }
      }
    });

    const { idToken } = userInfo;
    console.log(idToken);
    const credential = firebase.GoogleAuthProvider.credential(idToken);
    await firebase.signInWithCredential(auth, credential);
    router.push("/(tabs)/home")
  } catch (error: any) {
    // Utilisation de any ici car le type d'erreur est inconnu
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log(error);
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(error);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(error);
    } else {
      console.log(error, "errorMessage");
    }
  } finally {
    isSignInInProgress = false; // Unlock
  }

};

const signIn = async (
  email: string,
  password: string,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigation.replace("/(tabs)/home");
  } catch (error: any) {
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === "auth/invalid-email") {
      setError("Invalide email");
    } else if (firebaseError.code === "auth/invalid-password") {
      setError("Mot de Passe incorrect");
    } else if (firebaseError.code === "auth/too-many-requests") {
      setError("Veuillez attendre quelques instants");
    } else {
      setError(firebaseError.message);
    }
  }
};

const signUp = async (
  email: string,
  password: string,
  name: string,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const expoPushToken = await getExpoPushToken();

    if (user) {
      const userId = user.uid;
       if (expoPushToken) {
        set(ref(db, "users/" + userId), {
          email: email,
          name: name,
          expoPushToken
        });
       } else {
        set(ref(db, "users/" + userId), {
          email: email,
          name: name,
        });
       }
    }
    navigation.replace("/(tabs)/home");
  } catch (error: any) {
    const firebaseError = error as FirebaseError;
    console.log(firebaseError,'FirebaseError')
    if (firebaseError.code === "auth/email-already-in-use") {
      setError("Cette adresse email existe déjà");
    } else {
      setError(firebaseError.message);
    }
  }
};

const signOut = async (): Promise<void> => {
  try {
    await auth.signOut().then(() => router.replace('/(tabs)/Login')).catch((error:FirebaseError) => console.log(error));
  } catch (error) {
    throw error;
  }
};

export { signOut, signInWithGoogle, signIn, signUp };
