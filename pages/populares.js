import Layout from "../components/layout/Layout";
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";
import Spinner from "../components/ui/Spinner";

export default function Populares() {

  const {productos, cargando} = useProductos('votos');
  console.log(productos)

  if(cargando) return <Spinner />

  return (
    <div>
      <Layout>
            <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos?.map(producto => (
                <DetallesProducto 
                  key={producto.id}
                  producto= {producto}
                />
              ))}
            </ul>
          </div>
          </div>
      </Layout>
    </div>
  )
};
