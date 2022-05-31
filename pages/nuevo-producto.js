import Layout from "../components/layout/Layout";
import React, { useState, useContext } from "react";
import { css } from "@emotion/react";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import { FirebaseContext } from "../firebase";
import { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import Error404 from "../components/layout/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  imagen: "",
  url: "",
  descripcion: "",
};
let img;
const NuevoProducto = () => {
  const [error, guardarError] = useState(false);
  // States para la subida de la imagen
  const [uploading, setUploading] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operaciones CRUD de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  //   const subirImagen = async () => {
  //     //se obtiene referencia de la ubicación donde se guardara la imagen
  //     const file = img;
  //     const imageRef = ref(firebase.storage, 'productos/' + file?.name);

  //     //se inicia la subida
  //       setUploading(true);
  //       const uploadTask = await uploadBytesResumable(imageRef, file);
  //       const url = await getDownloadURL(uploadTask.ref);
  //       const urlImg = url;
  //       //await getDownloadURL(uploadTask.ref).then(urlImg => {
  //         //console.log('Imagen disponible en:', urlImg)
  //         setURLImagen(urlImg);
  //         console.log(urlImagen)
  // //});
  //       //setURLImagen(getDownloadURL(uploadTask.ref));
  //     setUploading(false);
  //   };

  const file = (e) => {
    const archivo = e.target.files[0];
    img = archivo;
  };

  async function crearProducto() {
    //si el usuario no esta logueado
    if (!usuario) {
      return router.push("/login");
    }
    const file = img;
    const imageRef = ref(firebase.storage, "productos/" + file?.name);
    setUploading(true);
    const uploadTask = await uploadBytesResumable(imageRef, file);
    const urlImg = await getDownloadURL(uploadTask.ref);
    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImg,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado: []
    };
    //insertar el producto en firestore
    try {
      await addDoc(collection(firebase.db, "productos"), producto);
      setUploading(false);
      router.push("/");
    } catch (error) {
      guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General</legend>
                {errores.nombre && <Error>{errores.nombre}</Error>}
                <Campo>
                  <label htmlFor='nombre'>Nombre</label>
                  <input
                    type='text'
                    id='nombre'
                    placeholder='Nombre del Producto'
                    name='nombre'
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}
                <Campo>
                  <label htmlFor='email'>Empresa</label>
                  <input
                    type='text'
                    id='empresa'
                    placeholder='Empresa'
                    name='empresa'
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.imagen && <Error>{errores.imagen}</Error>}
                <Campo>
                  <label htmlFor='image'>Imagen</label>
                  <input
                    type='file'
                    accept='image/*'
                    id='image'
                    name='image'
                    value={imagen}
                    onChange={(handleChange, file)}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
                <Campo>
                  <label htmlFor='url'>URL</label>
                  <input
                    type='url'
                    placeholder='URL de tu producto'
                    id='url'
                    name='url'
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
              </fieldset>
              <fieldset>
                <legend>Sobre tu Producto</legend>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
                <Campo>
                  <label htmlFor='descripcion'>Descripción</label>
                  <textarea
                    id='descripcion'
                    placeholder='Descripción del Producto'
                    name='descripcion'
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
              </fieldset>
              {error && <Error>{error}</Error>}
              <InputSubmit
                type='submit'
                value='Crear Producto'
                //onClick={subirImagen}
              />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
