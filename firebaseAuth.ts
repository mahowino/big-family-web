// firebaseAuth.ts
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase.config";

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return signOut(auth);
};

export const monitorAuthState = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};
