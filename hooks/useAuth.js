import { useEffect, useState } from "react";
import firebase from "../firebase/firebase";
//import { getAuth, onAuthStateChanged } from "firebase/auth";

function useAuth() {
  const [usuarioAuth, guardarUsuarioAuth] = useState(null);
  useEffect(() => {
    const unsuscribe = firebase.auth.onAuthStateChanged(user => {
      if(user) {
        guardarUsuarioAuth(user);
      } else {
        guardarUsuarioAuth(null)
      }
    })
    return () => unsuscribe();
  }, []);
  return usuarioAuth;
}

export default useAuth;