import {initializeApp} from "firebase/app";
import firebaseConfig from "./config";
import {createUserWithEmailAndPassword, updateProfile, getAuth, signInWithEmailAndPassword} from "firebase/auth";
import "firebase/firestore";
import { getFirestore} from 'firebase/firestore';
import { getStorage } from '@firebase/storage';

class Firebase {
    constructor(){
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app);
        this.db = getFirestore(app);
        this.storage = getStorage(app);
    }
    //registra un usuario
    async registrar(nombre, email, password) {
      
        const {user} = await createUserWithEmailAndPassword(this.auth, email, password);

      await updateProfile(user, {
        displayName: nombre
      })
    };

    //inicia sesión del usuario
    async login(email, password) {
      await signInWithEmailAndPassword(this.auth, email, password);
    };

    //cierra la sesión del usuario
    async cerrarSesion() {
      await this.auth.signOut();
    };
}

const firebase = new Firebase();
export default firebase;