import winston from "winston"
import config from "../config/config.js"
const { createLogger, format, transports } = winston

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "orange",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
}

//Logger DESARROLLO
const devLogger = createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new transports.Console({
            level: "debug",
            /* format: format.combine(
                format.colorize({ colors: customLevelOptions.colors }),
                format.simple()
            ) */
            format: format.simple()
        }),
        new transports.File({
            filename: "./errors.log",
            level: "error",
            format: format.simple()
        })
    ]
})

//Logger PRODUCTIVO
const prodLogger = createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new transports.Console({
            level: "info",
            /* format: format.combine(
                format.colorize({ colors: customLevelOptions.colors }),
                format.simple()
            ) */
            format: format.simple()
        }),
        new transports.File({
            filename: "./errors.log",
            level: "error",
            format: format.simple()
        })
    ]
})

//Middleware
export const addLogger = (req, res, next) => {
    if (config.environment === "production") {
        req.logger = prodLogger
    } else {
        req.logger = devLogger
    }
    next()
}
