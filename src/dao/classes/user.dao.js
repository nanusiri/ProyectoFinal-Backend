import userModel from "../models/user.model.js"
import CustomError from "../../services/errors/CustomError.js"
import { asignarRolErrorInfo, buscarPorIdErrorInfo, buscarUsuarioErrorInfo, documentosSinCargar, newPasswordCopyErrorInfo, newPasswordErrorInfo, noAuthOwner } from "../../services/errors/info.js"
import EErrors from "../../services/errors/enums.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import productModel from "../models/product.model.js"
import cartModel from "../models/cart.model.js"

const JWT_SECRET = 'tu_secreto_super_seguro'

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nanualejandro@gmail.com",
        pass: "xkjh hlev pysq cvvz"
    }
})

export default class User {
    registrarUsuario = async (first_name, last_name, email, age, password, role, phone) => {
        try {
            const cart = await cartModel.create({ titularCarrito: email })

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password,
                role,
                phone,
                cart
            }

            let result = await userModel.create(newUser)
            return result
        } catch (error) {
            console.error(error);
            return null
        }
    }

    loguearUsuario = async (email, password) => {
        try {
            const user = await userModel.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1, role: 1, phone: 1, cart: 1 })


            if (user.password === password) {
                user.last_connection = new Date()
                user.save()

                return user;
            } else {
                return null
            }


        } catch (error) {
            console.error(error);
            return null
        }
    }

    ultimaConexion = async (email) => {
        try {
            const user = await userModel.findOne({ email })

            user.last_connection = new Date()
            user.save()

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    restablecerContrasenia = async (email, newPassword, newPasswordCopy, token) => {
        try {
            const decodedToken = jwt.verify(token, JWT_SECRET)
            console.log('Token decodificado:', decodedToken)
            const user = await userModel.findOne({ email: decodedToken.email, resetToken: token });
            console.log('Usuario encontrado:', user)


            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(email),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            if (newPassword === user.password) {
                return CustomError.createError({
                    name: "No puede colocar la misma contraseña que tenia antes",
                    cause: newPasswordErrorInfo(),
                    message: "Intento cambiar su contraseña por la que tiene actualmente activa",
                    code: EErrors.INVALID_PARAMS
                })
            }

            if (newPassword != newPasswordCopy) {
                return CustomError.createError({
                    name: "Las contraseñas no son iguales",
                    cause: newPasswordCopyErrorInfo(),
                    message: "Las dos contraseñas que ingreso deben ser iguales",
                    code: EErrors.INVALID_PARAMS
                })
            }

            user.password = newPassword
            user.resetToken = undefined
            user.save()
            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    enviarMail = async (email) => {
        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(email),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' })
            console.log('Token generado', resetToken)
            user.resetToken = resetToken
            await user.save()

            const resetLink = `http://localhost:8080/restablecerContrasenia/${resetToken}`

            const mailOptions = {
                from: "nanualejandro@gmail.com",
                to: email,
                subject: "Solicitud de cambio de contraseña",
                html: `
                <div>
                    <h1>Hola ${user.first_name}</h1>
                    <p>Usted ha solicitado un cambio de contraseña, para realizarlo haga click en el siguiente link:</p>
                    <a href="${resetLink}" target="_blank">${resetLink}</a>
                </div>
                `
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log("correo enviado", info.response)
                }
            })

            return user
        } catch (error) {
            console.error(error);
            return null
        }
    }

    nuevoRol = async (uid) => {
        try {
            const user = await userModel.findById({ _id: uid })

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            if (user.role == "user" && user.documents.length === 3 && user.documents.every(doc => doc.name && doc.reference)) {
                user.role = "premium"
                await user.save()
                return user
            } else if (user.role == "premium") {
                user.role = "user"
                await user.save()
                return user
            } else {
                return CustomError.createError({
                    name: "El usuario no cargo la informacion necesaria para obtener el rol premium",
                    cause: documentosSinCargar(user),
                    message: "Cuando termine de cargar los documentos solicitados podra obtener el rol premium",
                    code: EErrors.FILES_NO_UPLOADED
                })
            }
        } catch (error) {
            console.error(error);
            return null
        }
    }

    buscadorAdmin = async (uid) => {
        try {
            const user = await userModel.findById({ _id: uid })

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    userRender = async (uid) => {
        try {
            console.log(uid)
            const user = await userModel.findById({ _id: uid })


            console.log(user)

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    subirDocumentos = async (uid, docs) => {
        try {
            const user = await userModel.findById({ _id: uid })

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            const nuevosDocumentos = []

            for (let index = 0; index < docs.length; index++) {
                let doc = {}
                let nombre = docs[index].originalname;
                doc.name = nombre
                let reference = docs[index].path
                doc.reference = reference

                nuevosDocumentos.push(doc)
            }
            user.documents = nuevosDocumentos

            await user.save()

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    subirProfileImage = async (uid, image) => {
        try {
            const user = await userModel.findById({ _id: uid })

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            user.profile_image = image.originalname

            await user.save()

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    subirProductImage = async (uid, pid, image) => {
        try {
            const user = await userModel.findById({ _id: uid })

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            const product = await productModel.findById({ _id: pid })

            if (!product) {
                return CustomError.createError({
                    name: "Producto no encontrado en la DB",
                    cause: buscarPorIdErrorInfo(pid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            if (product.productOwner != user.email && user.role != "admin") {
                return CustomError.createError({
                    name: "No puede agregar una imagen a un producto que no le pertenece",
                    cause: noAuthOwner(product),
                    message: "Esta intentando agregar una imagen a un producto que no le pertenece",
                    code: EErrors.NO_AUTH
                })
            }

            product.productImage = image.originalname

            await product.save()

            return product

        } catch (error) {
            console.error(error);
            return null
        }
    }

    usuariosRegistrados = async () => {
        try {

            const users = await userModel.find({}, { first_name: 1, last_name: 1, email: 1, role: 1 })

            if (!users) {
                return CustomError.createError({
                    name: "No hay usuarios en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "Primero debe haber usuarios registrados para poder buscarlos",
                    code: EErrors.INVALID_PARAMS
                })
            }

            return users

        } catch (error) {
            console.error(error);
            return null
        }
    }

    eliminarUsuariosPorInactividad = async () => {
        try {

            const users = await userModel.find({}, { first_name: 1, email: 1, last_connection: 1 })

            if (!users) {
                return CustomError.createError({
                    name: "No hay usuarios en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "Primero debe haber usuarios registrados para poder buscarlos",
                    code: EErrors.INVALID_PARAMS
                })
            }

            let inactivos = []

            for (let i = 0; i < users.length; i++) {
                const usuario = users[i];

                const inactividadEnMs = new Date() - new Date(usuario.last_connection)
                const inactividadEnMinutos = inactividadEnMs / (1000 * 60)

                if (inactividadEnMinutos > 2880) {
                    const mailOptions = {
                        from: "nanualejandro@gmail.com",
                        to: usuario.email,
                        subject: "Su cuenta fue eliminada",
                        html: `
                        <div>
                            <h1>Hola ${usuario.first_name}</h1>
                            <p>Su cuenta ha sido eliminada por estar inactivo mas de 2 dias</p>
                        </div>
                        `
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log("correo enviado", info.response)
                        }
                    })


                    usuario.deleteOne()

                }
            }




            return users

        } catch (error) {
            console.error(error);
            return null
        }
    }

    eliminarUsuario = async (uid) => {
        try {

            const user = await userModel.findByIdAndDelete(uid)

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias para eliminar",
                    code: EErrors.INVALID_PARAMS
                })
            }

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }

    adminCambiaRol = async (uid, nuevoRol) => {
        try {

            const user = await userModel.findById(uid)

            if (!user) {
                return CustomError.createError({
                    name: "Usuario no encontrado en la DB",
                    cause: buscarUsuarioErrorInfo(uid),
                    message: "No hubo coincidencias para eliminar",
                    code: EErrors.INVALID_PARAMS
                })
            }

            user.role = nuevoRol

            await user.save()

            return user

        } catch (error) {
            console.error(error);
            return null
        }
    }
}