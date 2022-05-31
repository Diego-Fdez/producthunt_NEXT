import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../firebase";
import { getDocs, query, collection, orderBy } from "firebase/firestore";

const useProductos = orden => {

  const [productos, guardarProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const {firebase} = useContext(FirebaseContext);

  

  useEffect(() => {
    try {
      const getProducts = async () => {
        setCargando(true);
        const result = await getDocs(query(collection(firebase.db, 'productos'), orderBy(orden,'desc')));
        const res = result.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          }
        });
        guardarProductos(res);
        setCargando(false)
      };
      getProducts();
    } catch (error) {
      console.log(error);
      setCargando(false);
    }
  }, [])

  return {
    productos,
    cargando
  }

};

export default useProductos;