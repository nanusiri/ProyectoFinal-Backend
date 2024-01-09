import EErrors from "../../services/errors/enums.js";
import CustomError from "../../services/errors/CustomError.js";


export default (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_PARAMS:
            res.send({ status: "error", error: error.name })
            break
        case EErrors.NO_AUTH:
            res.send({ status: "error", error: error.name })
            break
        default:
            res.send({ status: "error", error: "Error desconocido" })
    }
}