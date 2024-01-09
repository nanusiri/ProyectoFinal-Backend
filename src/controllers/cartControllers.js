import CartDTO from '../dao/DTOs/cart.dto.js'
import Cart from '../dao/classes/cart.dao.js'
import Ticket from '../dao/classes/ticket.dao.js'

const cartService = new Cart()
const ticketService = new Ticket()

export const crearCarrito = async (req, res) => {
    const titular = req.body

    let cart = new CartDTO(titular)

    let result = await cartService.crearCarrito(cart)
    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.send({ result: "success", payload: result })
}




export const obtenerCarrito = async (req, res) => {
    const cid = req.params.cid

    let result = await cartService.obtenerCarrito(cid)
    if (!result) {
        return res.status(500).send({ status: "Error", error: "Algo salió mal" })
    }

    res.render('cartView', { result })
}




export const agregarProducto = async (req, res) => {
    const user = req.session.user
    const pid = req.params.pid
    const quantity = parseInt(req.body.quantity || 1)


    let result = await cartService.agregarProducto(pid, quantity, user)
    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.send({ result: "success", payload: result })
}


export const actualizarCarrito = async (req, res) => {
    const cid = req.params.cid
    const updateFields = req.body

    const updateFieldsDTO = new CartDTO(updateFields)

    let result = await cartService.actualizarCarrito(cid, updateFieldsDTO)
    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.send({ result: "success", payload: result })
}



export const actualizarCantidad = async (req, res) => {
    const newQuantity = req.body
    const cid = req.params.cid
    const pid = req.params.pid

    let result = await cartService.actualizarCantidad(newQuantity, cid, pid)
    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.send({ result: "success", payload: result })
}


export const eliminarProducto = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    let result = await cartService.eliminarProducto(cid, pid)
    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.send({ result: "success", payload: result })
}


export const eliminarCarrito = async (req, res) => {
    const cid = req.params.cid


    let result = await cartService.eliminarCarrito(cid)
    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.send({ result: "success", payload: result })
}


export const finalizarCompra = async (req, res) => {
    const cid = req.params.cid
    const email = req.session.user.email
    const nombre = req.session.user.first_name
    const phone = req.session.user.phone

    let result = await ticketService.generarTicket(cid, email, nombre, phone)

    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.redirect(`/api/carts/${result._id}/ticket`)
}

export const renderTicket = async (req, res) => {
    const tid = req.params.tid

    let result = await ticketService.obtenerTicket(tid)

    if (!result) return res.status(500).send({ status: "Error", error: "Algo salió mal" })

    res.render('ticketView', { result })
}

