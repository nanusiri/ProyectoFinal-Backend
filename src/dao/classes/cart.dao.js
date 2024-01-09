import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import CustomError from "../../services/errors/CustomError.js";
import { agregarAlCarritoErrorInfo, buscarPorIdErrorInfo, noCart } from "../../services/errors/info.js";
import EErrors from "../../services/errors/enums.js";
import userModel from "../models/user.model.js";


export default class Cart {
    crearCarrito = async (titularCarrito) => {
        try {

            const result = await cartModel.create(titularCarrito)


            return result

        } catch (error) {

            console.error(error);
            return null

        }
    }

    obtenerCarrito = async (cid) => {
        try {

            const cart = await cartModel.findById({ _id: cid })

            if (!cart) {
                return CustomError.createError({
                    name: "El usuario no tiene carrito creado",
                    cause: noCart(product),
                    message: "Esta intentando agregar un producto a un carrito que no existe",
                    code: EErrors.NO_AUTH
                })
            }

            const arrayProductos = cart.productos

            let total = arrayProductos.reduce(function (acumulador, producto) {
                return acumulador + producto.subtotal
            }, 0)

            cart.total = total

            await cart.save()

            return cart
        } catch (error) {
            console.error(error);
            return null
        }
    }

    agregarProducto = async (pid, quantity, user) => {
        try {
            const cid = user.cart

            const cart = await cartModel.findById({ _id: cid })
            const product = await productModel.findById({ _id: pid })

            if (!cart) {
                return CustomError.createError({
                    name: "El usuario no tiene carrito creado",
                    cause: noCart(product),
                    message: "Esta intentando agregar un producto a un carrito que no existe",
                    code: EErrors.NO_AUTH
                })
            }

            if (!product) {
                return CustomError.createError({
                    name: "El producto no existe en nuestra DB",
                    cause: buscarPorIdErrorInfo(pid),
                    message: "Esta buscando un producto con un id que no tiene ninguna coincidencia en nuestra DB",
                    code: EErrors.NO_AUTH
                })
            }


            if (user.email == product.productOwner) {
                return CustomError.createError({
                    name: "No puede agregar al carrito un producto que le pertenece",
                    cause: agregarAlCarritoErrorInfo(product),
                    message: "Esta intentando agregar un producto al carrito que ya le pertenece",
                    code: EErrors.NO_AUTH
                })
            }

            const productos = cart.productos

            const existingProductIndex = productos.findIndex(objeto => objeto.producto.equals(pid))

            const subtotal = product.productPrice * quantity

            if (existingProductIndex !== -1) {
                productos[existingProductIndex].quantity += quantity
                productos[existingProductIndex].subtotal += product.productPrice * quantity
            } else {
                cart.productos.push({ producto: pid, nombre: product.productTitle, quantity: quantity, subtotal: subtotal })
            }

            await cart.save()

            return cart
        } catch (error) {
            console.error(error);
            return null
        }
    }

    actualizarCarrito = async (cid, updateFields) => {
        try {

            const cart = await cartModel.findByIdAndUpdate({ _id: cid }, { $set: { productos: { ...updateFields } } }, { new: true })
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' })
            }

            cart.productos[0].id = updateFields.productos

            return cart

        } catch (error) {
            console.error(error);
            return null
        }
    }

    actualizarCantidad = async (newQuantity, cid, pid) => {
        try {

            const cart = await cartModel.findById({ _id: cid })
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' })
            }
            console.log(cart)
            const productInCart = cart.productos.find(producto => producto.producto.equals(pid))
            console.log(productInCart)
            if (!productInCart) {
                return console.log('Producto no encontrado')
            }

            productInCart.quantity = newQuantity.quantity

            await cart.save()

            return cart

        } catch (error) {
            console.error(error);
            return null
        }
    }

    eliminarProducto = async (cid, pid) => {
        try {

            const cart = await cartModel.findById({ _id: cid })
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' })
            }

            const productInCart = cart.productos.find(producto => producto.id === pid)

            if (!productInCart) {
                return res.status(404).json({ error: 'Producto no encontrado' })
            }

            cart.productos = cart.productos.filter(producto => producto.id !== pid)

            await cart.save()

            return cart

        } catch (error) {
            console.error(error);
            return null
        }
    }

    eliminarCarrito = async (cid) => {
        try {

            const cart = await cartModel.findById({ _id: cid })

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' })
            }

            cart.productos = []

            await cart.save()

            return cart

        } catch (error) {
            console.error(error);
            return null
        }
    }

}