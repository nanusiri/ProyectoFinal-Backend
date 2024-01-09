import { faker } from "@faker-js/faker"
import ProductDTO from "./dao/DTOs/product.dto.js"
import EErrors from "./services/errors/enums.js"
import CustomError from "./services/errors/CustomError.js"
import { noAuth } from "./services/errors/info.js"
import multer from "multer"
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destinationFolder = 'public/docs'

        if (file.fieldname === 'profileImage') {
            destinationFolder = 'public/profiles';
        } else if (file.fieldname === 'productImage') {
            destinationFolder = 'public/products';
        }

        const destinationPath = path.join(__dirname, destinationFolder)
        cb(null, destinationPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
export const uploader = multer({ storage })

export const generateProduct = () => {
    const newProduct = {
        titulo: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code: faker.number.int({ max: 10000 }),
        price: faker.commerce.price(),
        status: true,
        stock: faker.number.int({ max: 10000 }),
        category: faker.commerce.productAdjective()
    }
    let product = new ProductDTO(newProduct)
    return product
}

export const adminAuth = (req, res, next) => {
    const user = req.session.user
    if (user.role == "admin") {
        next()
    } else {
        CustomError.createError({
            name: "User no es admin",
            cause: noAuth(user),
            message: "El usuario no es admin y no puede realizar esta actividad",
            code: EErrors.NO_AUTH
        })
    }
}

export const ownerAdminAuth = (req, res, next) => {
    const user = req.session.user
    if (user.role == "user") {
        CustomError.createError({
            name: "Usuarios con rol user no pueden crear productos",
            cause: noAuth(user),
            message: "El usuario no es premium ni admin y no puede realizar esta actividad",
            code: EErrors.NO_AUTH
        })
    } else {
        next()
    }
}

export const userAuth = (req, res, next) => {
    const user = req.session.user
    if (user.role == "admin") {
        CustomError.createError({
            name: "Admin no autorizado",
            cause: noAuth(user),
            message: "Un administrador no puede realizar esta actividad",
            code: EErrors.NO_AUTH
        })
    } else {
        next()
    }
}

