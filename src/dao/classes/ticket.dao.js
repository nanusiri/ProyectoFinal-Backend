import ticketModel from "../models/ticket.model.js";
import Cart from './cart.dao.js'
import Product from "./product.dao.js"
import nodemailer from "nodemailer"
import twilio from "twilio"
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import { buscarPorIdErrorInfo, noStock } from "../../services/errors/info.js";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nanualejandro@gmail.com",
        pass: "xkjh hlev pysq cvvz"
    }
})

const TWILIO_ACCOUNT_SID = "AC707d219ce2c5dd26ba5badaef23ce3df"
const TWILIO_AUTH_TOKEN = "b9b2744b0b2a0c2e51cb3a3d1242a78f"
const TWILIO_SMS_NUMBER = "+12052094852"

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


const productService = new Product()
const cartService = new Cart()

export default class Ticket {

    generarTicket = async (cid, email, nombre, phone) => {
        try {

            let cart = await cartService.obtenerCarrito(cid)

            let titularCarrito = cart.titularCarrito

            let products = cart.productos.map(item => item.producto)
            let quantities = cart.productos.map(item => item.quantity)

            let purchaseProducts = []

            let outOfStock = []

            let prices = []

            let productsName = []

            for (let index = 0; index < products.length; index++) {
                const product = products[index]
                const quantity = quantities[index]
                const result = await productService.obtenerXProducto(product)

                productsName.push(result.productTitle)

                let stock = result.productStock

                if (stock >= quantity) {
                    let newStock = stock - quantity
                    await productService.actualizarStockProducto(product, newStock)
                    let price = result.productPrice
                    prices.push(price)
                    purchaseProducts.push(product)
                } else {
                    outOfStock.push(product);
                }
            }

            if (purchaseProducts.length <= 0) {
                return CustomError.createError({
                    name: "Sin Stock",
                    cause: noStock(outOfStock),
                    message: "Esta intentando comprar productos que no tienen suficiente stock",
                    code: EErrors.NO_AUTH
                })
            }

            const newTicket = {}

            let amount = 0

            for (let i = 0; i < prices.length; i++) {
                const price = prices[i]
                const quantity = quantities[i]
                amount += price * quantity
            }

            newTicket.amount = amount
            newTicket.purchaser = titularCarrito

            //Eliminar productos del carrito que ya se compraron y dejar los que no 
            newTicket.unpurchasedProducts = outOfStock
            let carritoSinStock = cart.productos.filter(item => outOfStock.includes(item.producto))
            cart.productos = carritoSinStock
            if (cart.productos.length > 0) {
                let total = cart.productos.reduce(function (acumulador, producto) {
                    return acumulador + producto.subtotal
                }, 0)

                cart.total = total

            } else {
                cart.total = 0
            }
            await cart.save()



            let result = await ticketModel.create(newTicket)

            //Enviar mail
            const mailOptions = {
                from: "nanualejandro@gmail.com",
                to: email,
                subject: "Su compra fue realizada con exito",
                text: `${nombre}, tu compra de el/los productos: "${productsName}", con un valor de $${result.amount}, fue realizada con exito.
El codigo de tu compra es: ${result.code}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    res.send("error de envio")
                } else {
                    console.log("correo enviado", info.response)
                    res.send("Correo enviado con exito")
                }
            })

            //Enviar SMS
            await client.messages.create({
                body: `Hola ${nombre}, muchas gracias por tu compra, tu pedido esta en camino. Esperamos que vuelvas a comprar`,
                from: TWILIO_SMS_NUMBER,
                to: phone
            })


            return result

        } catch (error) {
            console.error(error);
            return null
        }
    }

    obtenerTicket = async (tid) => {
        try {

            const ticket = await ticketModel.findById({ _id: tid })


            if (!ticket) {
                return CustomError.createError({
                    name: "No existe ticket con el id proporcionado",
                    cause: buscarPorIdErrorInfo(tid),
                    message: "No hubo coincidencias",
                    code: EErrors.INVALID_PARAMS
                })
            }

            return ticket
        } catch (error) {
            console.error(error);
            return null
        }

    }
}