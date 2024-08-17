import express from 'express'
import productsRouter from "./routes/products.router.js"
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import exphbs from 'express-handlebars'
import './database.js'
import { Server } from "socket.io"
import MessageModel from './models/message.model.js'
import session from "express-session"
import MongoStore from "connect-mongo"
import usersRouter from './routes/user.router.js'
import sessionsRouter from './routes/session.router.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { ProductService } from './services/products.service.js'
import configObject from './config/config.js'
import handleError from './middlewares/error.js'
import addLogger from './utils/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'


const {mongo_url} = configObject

const app = express()

app.use(addLogger)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./src/public"))

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

const PORT = 8080

app.use(session({
    secret:"secretBaseCoderHouse",
    resave: true,
    saveUninitialized : true,
    store: MongoStore.create({
        mongoUrl: mongo_url , ttl: 1800
    })
}))
app.use(passport.initialize())
app.use(passport.session())
initializePassport()

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del Ecommerce",
            description: "App de prueba para el desafio 13 de la clase 39."
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}
const specs = swaggerJSDoc(swaggerOptions)

app.use('/api/products', productsRouter)
app.use('/api/carts',  cartsRouter)
app.use('/',  viewsRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use(handleError)

const httpServer = app.listen(PORT, () => {
    console.log(`Leyendo el puerto http://localhost:${PORT}`)
})
const io = new Server(httpServer)


io.on("connection", (socket) => {
    socket.on("mensaje", (data) => {
        console.log(data)
    })
    socket.on('prod', async(data) => {
        await ProductService.addProducts(data)
    })
    socket.on('deleteProd', async(data) => {
        const productToDelete = await ProductService.findProductByCode(data.code)
        if(productToDelete && data.owner === "Admin"){
            await ProductService.deleteProduct(productToDelete._id)
            socket.emit("prodsJson", '/api/products')
        }
        else if(productToDelete && productToDelete.owner === data.owner){
            await ProductService.deleteProduct(productToDelete._id)
            socket.emit("prodsJson", '/api/products')
        }
    })

    socket.emit("prodsJson", '/api/products')

    socket.on("message", async data => {
        await MessageModel.create(data)
        const messageData = await MessageModel.find()
        io.sockets.emit("message", messageData)
    })
})
