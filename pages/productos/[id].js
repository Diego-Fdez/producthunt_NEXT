import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { FirebaseContext } from "../../firebase";
import { getDoc, doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Spinner from "../../components/ui/Spinner";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import es from "date-fns/locale/es";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  //state del componente
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comment, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  //Routing para obtener el ID actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && setConsultarDB) {
      const getProducto = async () => {
        const docRef = doc(firebase.db, "productos", `${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap?.exists()) {
          setProducto(docSnap.data());
          setConsultarDB(false);
        } else {
          // doc.data() will be undefined in this case
          setError(true);
          setConsultarDB(false);
        }
      };
      getProducto();
    }
  }, [id, producto]);

  if (Object.keys(producto).length === 0 && !error) return <Spinner />;

  //función para votar
  const votarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }

    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //verificar si el usuarios actual ha votado
    if (haVotado.includes(usuario.uid)) return;

    //guardar el id del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];

    //actualizar en la BD
    const docRef = doc(firebase.db, "productos", `${id}`);
    await updateDoc(docRef, {
      votos: increment(nuevoTotal),
      haVotado: nuevoHaVotado,
    });

    //actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });
    setConsultarDB(true); //hay un voto, por lo tanto consulta a la base de datos
  };

  const {
    nombre,
    creador,
    comentarios,
    creado,
    descripcion,
    empresa,
    url,
    urlImg,
    votos,
    haVotado,
  } = producto;

  //funciones para crear comentarios
  const comentarioChange = (e) => {
    setComentario({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  //identifica si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador?.id == id) {
      return true;
    }
  };

  //función que guarda en la BD los comentarios
  const agregarComentario = async (e) => {
    e.preventDefault();
    e.target.reset();
    if (!usuario) {
      return router.push("/login");
    }
    //información extra al comentario
    comment.usuarioId = usuario.uid;
    comment.usuarioNombre = usuario.displayName;

    //tomar copia de comentarios y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comment];

    //actualiza la BD
    const docRef = doc(firebase.db, "productos", `${id}`);
    await updateDoc(docRef, {
      comentarios: nuevosComentarios,
    });
    comment.mensaje = "";

    //actualiza el state
    setComentario({
      ...producto,
      comentarios: nuevosComentarios,
    });
    setConsultarDB(true); //hay un comentario, por lo tanto consulta a la base de datos
  };

  //función que revisa si el creador del producto sea el mismo que esta autenticado
  const puedeBorrar = () => {
    if(!usuario) return false;

    if(creador?.id === usuario.uid) {
      return true;
    }
  };

  const eliminarProducto = async () => {
    if(!usuario) {
      return router.push('/login');
    }
    if(creador.id !== usuario.uid) {
      return router.push('/');
    }
    try {
      //eliminar en la BD
    const docRef = doc(firebase.db, "productos", `${id}`);
    await deleteDoc(docRef);
    router.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className='contenedor'>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador?.nombre} de {empresa}
                </p>
                <img src={urlImg} alt={`imagen de ${nombre}`} />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type='text'
                          name='mensaje'
                          onChange={comentarioChange}
                        />
                      </Campo>
                      <InputSubmit type='submit' value='Agregar Comentario' />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aún no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                              margin-left: 1rem;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target='_Blank' bgColor='true' href={url}>
                  Visitar URL
                </Boton>
                <div
                  css={css`
                    margin: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos
                  </p>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() &&
            <Boton 
              onClick={eliminarProducto}
            >Eliminar Producto</Boton>}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
