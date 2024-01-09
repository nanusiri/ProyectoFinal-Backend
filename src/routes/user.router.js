import express from "express"
const router = express.Router()
import { register, login, cambiarContrasenia, contraseniaOlvidada, cambiarRol, logout, upload, uploadProfileImage, uploadProductImage, obtenerUsuarios, eliminarUsuarios, adminView, adminDetailView, eliminarUsuario, adminCambiaRol } from "../controllers/userControllers.js"
import { adminAuth, uploader } from "../utils.js"

router.post("/register", register)
router.get("/register", (req, res) => {
    res.render('register')
})

router.post("/login", login)
router.get("/login", (req, res) => {
    res.render('login')
})

router.get("/api/users/logout", logout)


//Restablecer contraseña
router.get("/enviarMail", contraseniaOlvidada)

router.post("/restablecerContrasenia/:token", cambiarContrasenia)
router.get("/restablecerContrasenia/:token", (req, res) => {
    res.render('recuperarContraseña')
})




router.get("/api/users/premium/:uid", cambiarRol)


//Subir archivos
router.post("/api/users/:uid/documents", uploader.array('file'), upload)
router.post("/api/users/:uid/profileImage", uploader.single('profileImage'), uploadProfileImage)
router.post("/api/users/:uid/productImage/:pid", uploader.single('productImage'), uploadProductImage)

router.get("/api/users", obtenerUsuarios)
router.delete("/api/users", eliminarUsuarios)

//API ADMIN
router.post("/api/admin", adminAuth, adminView)
router.get("/api/admin", adminAuth, (req, res) => {
    res.render('adminFunctions')
})
router.get("/api/admin/:uid", adminAuth, adminDetailView)
router.delete("/api/admin/:uid", adminAuth, eliminarUsuario)
router.patch("/api/admin/cambiarRol/:uid", adminAuth, adminCambiaRol)



export default router
