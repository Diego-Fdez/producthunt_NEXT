import Layout from "../components/layout/Layout";
import React, {useState} from "react";
import { css } from "@emotion/react";
import { Formulario, Campo, InputSubmit, Error } from "../components/ui/Formulario";
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";
import firebase from "../firebase/firebase";
import Router from "next/router";

const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {
  const [error, guardarError] = useState(false);

  const {
    valores,
    errores, 
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  
  const {email, password} = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      guardarError(error.message);
    }
  }
  
  return (
    <div>
      <Layout>
        <>
          <h1 
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Iniciar Sesión</h1>
          <Formulario 
            onSubmit={handleSubmit}
            noValidate
          >
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="email">Correo</label>
              <input 
                type="email"
                id="email"
                placeholder="Correo"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            <Campo>
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password"
                id="password"
                placeholder="Contraseña"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {error && <Error>{error}</Error>}
            <InputSubmit 
              type="submit"
              value="Iniciar Sesión"
            />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default Login