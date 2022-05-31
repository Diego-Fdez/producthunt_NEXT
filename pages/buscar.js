import Layout from "../components/layout/Layout";
import { useRouter, withRouter } from "next/router";
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner";

const Buscar = () => {
  const router = useRouter();
  const {
    query: { q },
  } = router;
  //todos los productos
  const { productos } = useProductos("creado");
  const [resultado, setResultado] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!q) return;

    const busqueda = q.toLowerCase();
    const filtro = productos.filter((producto) => {
      setCargando(true);
      return (
        producto.nombre
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(busqueda) ||
        producto.descripcion
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(busqueda) ||
        producto.empresa
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(busqueda)
      );
    });
    setResultado(filtro);
    setCargando(false);
  }, [q, productos]);

  if(cargando) return <Spinner />

  return (
    <div>
      <Layout>
        {resultado.length === 0 ? (
          <p>No hay productos para mostrar</p>
        ) : (
          <div className='listado-productos'>
            <div className='contenedor'>
              <ul className='bg-white'>
                {resultado.map((producto) => (
                  <DetallesProducto key={producto.id} producto={producto} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default withRouter(Buscar);
