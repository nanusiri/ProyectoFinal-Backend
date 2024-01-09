import { Router } from "express"
import {
    obtenerProductos,
    obtenerXProducto,
    nuevoProducto,
    actualizarProducto,
    eliminarProducto,
    mockProducts
} from "../controllers/productControllers.js"
import { adminAuth, ownerAdminAuth } from "../utils.js"

const router = Router()

router.get('/api/products', obtenerProductos)

router.get('/api/products/:pid', obtenerXProducto)

router.post('/api/products', ownerAdminAuth, nuevoProducto)

router.put('/api/products/:pid', adminAuth, actualizarProducto)

router.delete('/api/products/:pid', ownerAdminAuth, eliminarProducto)

router.get('/api/mockingproducts', mockProducts)


export default router