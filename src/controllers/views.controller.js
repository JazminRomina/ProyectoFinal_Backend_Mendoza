import productsModel from '../models/products.model.js'
import { ProductService } from '../services/products.service.js'
import { CartService } from '../services/carts.service.js'
import DTOuser from '../DTO/user.dto.js'
import usersModel from '../models/users.model.js'

export class ViewsController{
    allProdsRender = async(req, res) => {
    if(!req.session.login){
        return res.redirect("/login")
    }
    const allProds = await ProductService.getAllProdsViews(req)
    res.render("home", {
        prods: allProds.response.payload,
        hasPrevPage: allProds.response.hasPrevPage,
        hasNextPage: allProds.response.hasNextPage,
        prevPage: allProds.response.prevPage,
        nextPage: allProds.response.nextPage,
        currentPage: allProds.response.page,
        totalPages: allProds.response.totalPages
    })
    }

    realTimeProds = async(req, res) => {
        const user = req.user
        const allProds = await productsModel.find().lean()
        res.render("realTimeProducts", {prods: allProds, rol: user.rol, email: user.email})
    }

    chat = async (req, res) => {
        res.render("chat")
    }

    getProdsForView = async (req, res) => {
        const allProds = await ProductService.getAllProdsViews(req)
        res.render("products", {
            prods: allProds.response.payload,
            hasPrevPage: allProds.response.hasPrevPage,
            hasNextPage: allProds.response.hasNextPage,
            prevPage: allProds.response.prevPage,
            nextPage: allProds.response.nextPage,
            currentPage: allProds.response.page,
            totalPages: allProds.response.totalPages,
            user: req.session.user,
            session: req.session.login
        })
    }

    cartRender = async (req, res) => {
        try{
            const cid = req.params.cid
            const cartProdsInIt = await CartService.getCartById(cid)
            let totalPrice = 0
            const cartsTotalPrice = cartProdsInIt.products.map((p) => {
                const prod = p.product
                const quantity = p.quantity
                const finalPrice = prod.price * quantity
                totalPrice += finalPrice

                return {
                    ...p,
                    finalPrice: finalPrice
                }
            })
            res.render("carts", {
                productsCart: cartsTotalPrice,
                cartId: cartProdsInIt._id,
                finalTotalPrice: totalPrice
            })
        }
        catch(error){
            res.status(500).json('We could not find the cart')
        }
    }

    login = (req, res) => {
        if(req.session.login){
            return res.redirect("/profile")
        }
        res.render("login")
    }

    register = (req, res) => {
        res.render("register")
    }

    profile = async(req, res) => {
        if(!req.session.login){
            return res.redirect("/login")
        }
        req.session.user.rol = req.user.rol
        const userDTO = new DTOuser(req.session.user)
        const isPremium = userDTO.rol === "Premium"
        const isUser = userDTO.rol === "User"
        const isAdmin = userDTO.rol === "Admin"
        res.render("profile", { user: userDTO, premium: isPremium, users: isUser, admins: isAdmin})
    }

    logger = async(req, res) => {
        req.logger.fatal("Mensaje FATAL")
        req.logger.error("Mensaje ERROR")
        req.logger.warning("Mensaje WARNING")
        req.logger.info("Mensaje INFO")
        req.logger.http("Mensaje HTTP")
        req.logger.debug("Mensaje DEBUG")

        res.send("Test de Logs")
    }

    renderEmailPass = async(req, res) => {
        res.render("getemailpass")
    }

    renderResetPass = async(req, res) => {
        res.render("resetpass")
    }

    renderConfirmationEmail = async(req, res) => {
        res.render("confirmacion-envio")
    }

    renderChangeDelete = async(req, res) => {
        const userDTO = new DTOuser(req.session.user)
        const isAdmin = userDTO.rol === "Admin"
        if(isAdmin){
            const users = await usersModel.find({rol: {$in: ["User", "Premium"]}}).lean()
            return res.render("changeRolandDeleteUser", {users: users})
        }
        else{
            return res.send("You are not an admin!")
        }
    }
}