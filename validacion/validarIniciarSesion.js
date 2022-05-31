export default function validarIniciarSesion(valores) {
  let errores = {};

  //validar el email
  if(!valores.email) {
    errores.email = "El correo es obligatorio";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
    errores.email = "Correo no válido;"
  }

  //validar el password del usuario
  if(!valores.password) {
    errores.password = "La contraseña es obligatorio";
  } else if (valores.password < 6) {
    errores.password = "La contraseña debe ser de al menos 6 caracteres";
  }
  return errores;
}