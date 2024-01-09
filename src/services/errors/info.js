export const buscarPorIdErrorInfo = (pid) => {
    return `El id: ${pid}, no coincide con ningun producto en nuestra base de datos`
}

export const buscarUsuarioErrorInfo = (data) => {
    return `El email/id: ${data}, no coincide con ningun usuairo en nuestra base de datos`
}

export const nuevoProductoErrorInfo = (newProduct) => {
    return `El productCode: ${newProduct.productCode}, ya existe en nuestra base de datos`
}

export const noAuth = (user) => {
    return `El usuario ${user.first_name} no tiene la credencial necesaria para realizar esta actividad`
}

export const newPasswordErrorInfo = () => {
    return `El usuario intento cambiar su contraseña pero coloco la misma que antes`
}

export const newPasswordCopyErrorInfo = () => {
    return `Las dos contraseñas que ingreso el usuario no son iguales`
}

export const noAuthOwner = (product) => {
    return `El producto le pertenece a ${product.productOwner}, usted no lo puede eliminar`
}

export const agregarAlCarritoErrorInfo = () => {
    return `El producto que quiere agregar al carrito ya le pertenece a usted y no lo puede comprar`
}

export const documentosSinCargar = (user) => {
    return `El usuario ${user.first_name} quiere tener el rol premium pero no cargo la documentacion necesaria`
}

export const buscarUsuariosErrorInfo = () => {
    return `En la base de datos que esta intentando ingresar no hay ningun usuario creado`
}

export const asignarRolErrorInfo = () => {
    return `Esta asignandole un rol a un usuario que no es renocido como rol en nuestra base de datos`
}

export const noCart = () => {
    return `El cliente quiere agregar un producto al carrito pero no tiene carrito, tiene que actualizar su perfil`
}

export const noStock = (outOfStock) => {
    return `El o los productos: ${outOfStock.map(item => item.producto)} no tienen stock para completar su compra`
}