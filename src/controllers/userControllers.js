import User from "../dao/classes/user.dao.js"

const userService = new User()

export const register = async (req, res) => {
    const { first_name, last_name, email, age, password, role, phone } = req.body

    let result = await userService.registrarUsuario(first_name, last_name, email, age, password, role, phone)

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    res.redirect('/login')
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    let result = await userService.loguearUsuario(email, password)

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    req.session.user = result
    res.redirect('/api/products')
}

export const logout = async (req, res) => {

    const email = req.session.user.email

    let result = await userService.ultimaConexion(email)

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    req.session.user = undefined

    res.send({ status: "success", message: "El usuario se ha deslogueado correctamente" })
}

export const cambiarContrasenia = async (req, res) => {
    const { email, newPassword, newPasswordCopy } = req.body;
    const { token } = req.params

    let result = await userService.restablecerContrasenia(email, newPassword, newPasswordCopy, token)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", result: result })
}

export const contraseniaOlvidada = async (req, res) => {
    const { email } = req.body;

    let result = await userService.enviarMail(email)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", message: "Mail enviado correctamente" })
}

export const cambiarRol = async (req, res) => {
    const uid = req.params.uid

    let result = await userService.nuevoRol(uid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", payload: result })
}

export const adminView = async (req, res) => {
    const { uid } = req.body

    let result = await userService.buscadorAdmin(uid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.redirect(`/api/admin/${uid}`)
}

export const adminDetailView = async (req, res) => {
    const { uid } = req.params;

    let result = await userService.userRender(uid)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.render('adminDetailView', { user: result }); //El {user: result} sirve para mandar la info del usuario
};


export const upload = async (req, res) => {
    if (!req.files) {
        return res.status(400).send({ status: "error", error: "No se pudo cargar tu archivo" })
    }
    console.log(req.files)

    let docs = req.files
    const uid = req.params.uid

    let result = await userService.subirDocumentos(uid, docs)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", payload: result })
}

export const uploadProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: "error", error: "No se pudo cargar tu archivo" })
    }
    console.log(req.file)

    let image = req.file
    const uid = req.params.uid

    let result = await userService.subirProfileImage(uid, image)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", payload: result })
}

export const uploadProductImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ status: "error", error: "No se pudo cargar tu archivo" })
    }
    console.log(req.file)

    let image = req.file
    const uid = req.params.uid
    const pid = req.params.pid

    let result = await userService.subirProductImage(uid, pid, image)
    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })
    res.send({ status: "success", payload: result })
}

export const obtenerUsuarios = async (req, res) => {

    let result = await userService.usuariosRegistrados()

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    res.send({ status: "success", payload: result })
}

export const eliminarUsuarios = async (req, res) => {

    let result = await userService.eliminarUsuariosPorInactividad()

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    res.send({ status: "success", payload: result })
}

export const eliminarUsuario = async (req, res) => {

    const { uid } = req.params

    let result = await userService.eliminarUsuario(uid)

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    res.send({ status: "success", payload: result })
}

export const adminCambiaRol = async (req, res) => {

    const { uid } = req.params
    const { nuevoRol } = req.body

    let result = await userService.adminCambiaRol(uid, nuevoRol)

    if (!result) return res.status(500).send({ status: "error", error: "Algo salió mal" })

    res.send({ status: "success", payload: result })
}

