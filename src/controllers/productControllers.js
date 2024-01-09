import ProductDTO from "../dao/DTOs/product.dto.js"
import Product from "../dao/classes/product.dao.js"
import { generateProduct } from "../utils.js"

const productService = new Product()

export const obtenerProductos = async (req, res) => {
    const { limit = 10, page = 1, sort, category } = req.query
    if (isNaN(limit && page)) {
        return res.status(404).send({ status: "Error", error: "Limit y page tienen que ser un numero" })
    }

    const user = req.session.user

    let result = await productService.obtenerProductos(limit, page, sort, category)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.render('products', { result, user })
}

export const obtenerXProducto = async (req, res) => {
    const pid = req.params.pid

    let result = await productService.obtenerXProducto(pid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}



export const nuevoProducto = async (req, res) => {
    const newProduct = req.body
    const user = req.session.user
    console.log(user)
    let product = new ProductDTO(newProduct)

    let result = await productService.nuevoProducto(product, user)

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}



export const actualizarProducto = async (req, res) => {
    const pid = req.params.pid
    const updateFields = req.body

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar almenos un campo para actualizar' })
    }
    const updateFieldsDTO = new ProductDTO(updateFields)

    let result = await productService.actualizarProducto(pid, updateFieldsDTO)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}



export const eliminarProducto = async (req, res) => {
    const pid = req.params.pid

    const user = req.session.user

    let result = await productService.eliminarProducto(pid, user)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}

export const mockProducts = async (req, res) => {
    for (let i = 0; i < 3; i++) { //PUSE 3 POR QUE 100 ME DEMORABA MUCHO
        await productService.nuevoProducto(generateProduct())
    }

    res.send({ status: "success", msg: "Se crearon 100 productos con exito" })
}
