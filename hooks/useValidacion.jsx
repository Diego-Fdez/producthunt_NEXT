import React, { useState, useEffect } from "react";

const useValidacion = (stateInicial, validar, fn) => {

  const [valores, guardarValores] = useState(stateInicial);
  const [errores, guardarErrores] = useState({});
  const [submitForm, guardarSubmitForm] = useState(false);

  //válida el form
  useEffect(() => {
    if(submitForm) {
      const noErrores = Object.keys(errores).length === 0;
      if (noErrores) {
        fn(); //Fn = función que se ejecuta en el componente
      };
      guardarSubmitForm(false);
    };
  }, [errores]);

  //función que se ejecuta conforme el usuario escribe algo
  const handleChange = e => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value
    });
  };

  //función que se ejecuta cuando el usuario hace submit
  const handleSubmit = e => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
    guardarSubmitForm(true);
  };

  //cuando se realiza el evento de blur (salir del input)
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
  };
  
  return {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  };
}

export default useValidacion;