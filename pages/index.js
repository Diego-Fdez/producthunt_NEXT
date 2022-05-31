import Layout from "../components/layout/Layout";
import { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../firebase";
import { getDocs, query, collection, orderBy } from "firebase/firestore";
import DetallesProducto from "../components/layout/DetallesProducto";
import Spinner from "../components/ui/Spinner";

export default function Home() {

  const [productos, guardarProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const {firebase} = useContext(FirebaseContext);

  

  useEffect(() => {
    try {
      const getProducts = async () => {
        setCargando(true);
        const result = await getDocs(query(collection(firebase.db, 'productos'), orderBy('creado','desc')));
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

  if(cargando) return <Spinner />

  return (
    <div>
      <Layout>
      {productos.length === 0 ? <p>No hay productos para mostrar</p> : (
            <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map(producto => (
                <DetallesProducto 
                  key={producto.id}
                  producto= {producto}
                />
              ))}
            </ul>
          </div>
          </div>
      )}
      </Layout>
    </div>
  )
};
