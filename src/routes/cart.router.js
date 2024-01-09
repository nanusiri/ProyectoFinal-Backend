import { Router } from "express"
import {
    crearCarrito,
    obtenerCarrito,
    agregarProducto,
    actualizarCarrito,
    actualizarCantidad,
    eliminarProducto,
    eliminarCarrito,
    finalizarCompra,
    renderTicket
} from "../controllers/cartControllers.js"
import { userAuth } from "../utils.js"
import { addLogger } from "../services/logger.js"

const router = Router()

router.post("/api/carts", userAuth, crearCarrito)

router.get('/api/carts/:cid', addLogger, obtenerCarrito)

router.post('/api/carts/product/:pid', userAuth, agregarProducto)

router.put('/api/carts/:cid', actualizarCarrito) //Nunca entendi la funcion de este endpoint

router.put('/api/carts/:cid/products/:pid', actualizarCantidad)

router.delete('/api/carts/:cid/products/:pid', eliminarProducto)

router.delete('/api/carts/:cid', eliminarCarrito)

router.post("/api/carts/:cid/purchase", finalizarCompra)

router.get("/api/carts/:tid/ticket", renderTicket)

export default router;