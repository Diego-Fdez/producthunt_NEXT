export default function validarCrearProducto(valores) {
  let errores = {};

  //validar el nombre del usuario
  if(!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  //validar la empresa
  if(!valores.empresa) {
    errores.empresa = "El nombre de la empresa es obligatorio";
  } 

  //validar la url
  if(!valores.url) {
    errores.url = "La URL es obligatoria";
  } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "URL mal formateada o no válida";
  }

  //validar la descripción
  if(!valores.descripcion) {
    errores.descripcion = "La descripción del producto es obligatoria";
  } 
  return errores;
}