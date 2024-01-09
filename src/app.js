import express from 'express'
import cartRouter from './routes/cart.router.js'
import productRouter from './routes/products.router.js'
import userRouter from "./routes/user.router.js"
import mongoose from 'mongoose'
import session from 'express-session'
import bodyParser from 'body-parser'
import MongoStore from 'connect-mongo'
import config from "./config/config.js"
import compression from "express-compression"
import errorHandler from "./middlewares/errors/index.js"
import { addLogger } from './services/logger.js'
import path from 'path'
import { fileURLToPath } from 'url'
import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerUiExpress from 'swagger-ui-express';

const app = express();
const port = config.port || 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion de mi proyecto final",
            description: "API de mi e-commerce"
        }
    },
    apis: [`src/docs/miApi.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600
    }),
    secret: 'proyectoFinal',
    resave: false,
    saveUninitialized: true
})
)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/src/views/script.js', (req, res) => {
    res.type('application/javascript'); // Establece el tipo MIME a JavaScript
    res.sendFile('ruta/absoluta/al/script.js');
});

app.use("/", cartRouter);
app.use("/", productRouter);
app.use("/", userRouter)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression({
    brotli: { enabled: true, zlib: {} }
}))

app.use(errorHandler)


//TEST LOGGER
app.use(addLogger)

app.get("/loggerTest", (req, res) => {
    req.logger.debug("Logger nivel debug anda correctamente")
    req.logger.http("Logger nivel http anda correctamente")
    req.logger.info("Logger nivel info anda correctamente")
    req.logger.warning("Logger nivel warning anda correctamente")
    req.logger.error("Logger nivel error anda correctamente")
    req.logger.fatal("Logger nivel fatal anda correctamente")

    res.send({ msg: "test enviado por consola" })
})

app.listen(port, () => console.log(`Example app is active`));
