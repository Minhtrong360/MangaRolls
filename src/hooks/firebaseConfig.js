import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "Trong",
  authDomain: "Trong",
  projectId: "Trong",
  storageBucket: "Trong",
  messagingSenderId: "Trong",
  appId: "Trong",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
