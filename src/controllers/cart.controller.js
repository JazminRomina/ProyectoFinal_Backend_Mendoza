import ticketsModel from "../models/tickets.model.js"
import usersModel from "../models/users.model.js"
import { CartService } from "../services/carts.service.js"
import { ProductService } from "../services/products.service.js"
import { logger } from "../utils/logger.js"
import { EmailManager } from "../services/email.js"

const emailManager = new EmailManager()

export class CartsController {
    newCart = async(req, res) => {
        try{
            const cart = await CartService.createCart([])
            res.send({message: 'There is a new cart', cart: cart})
        }
        catch(error){
            res.status(500).json('There is an error in the server, we could not create a new cart.')
            logger.error('We could not create a new cart.')
        }
    }

    cartIdFound = async(req, res) => {
        let id = req.params.id
        try{
            const findId = await CartService.findId(id)
            res.json(findId)
            logger.info('We found the cart.')
        }
        catch(error){
            res.status(500).json('We did not find the ID of the cart.')
            logger.error('ID of the cart not found.')
        }
    }

    addProdtotheCart = async(req, res) => {
        const user = req.user || 'Admin'
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            const findIdProd = await ProductService.findIdProd(pid)
            const product = findIdProd[0]
            if(product.owner == user.email){
                return res.status(404).json({ message: 'You cannot buy your own product.'})
            }
            await CartService.addProductToTheCart(cid, pid)
            res.status(200).json({ message: 'The product has been added.'})
            logger.info('We add this product to the cart.')
        }
        catch(error){
            res.status(500).json('There is an error in the server that it did not let us add the product in the cart.')
            logger.error('We could not add this product to the cart, check the product before trying again.')
        }
    }

    deleteProdFromCart = async(req, res) => {
        try{
            let cid = req.params.cid
            let pid = req.params.pid
            await CartService.deleteaProductFromTheCart(cid, pid)
            res.send('The product has been eliminated from the cart.')
            logger.info('We deleted the product from the cart.')
        }
        catch(error){
            res.status(500).json('There is an error with the product you wanna delete.')
            logger.error('We could not eliminated the product.')
        }
    }

    updateProdCart = async(req, res) => {
        let cid = req.params.cid
        let prods = req.body
        try{
            await CartService.updateProductsFromCart(cid,prods)
            res.send('Products have been updated.')
            logger.info('We updated the product.')
        }
        catch(error){
            res.status(500).json('We did not change the product, check the id and the things you wanna change on the product.')
            logger.error('There is a problem with the product you wanna update.')
        }
    }

    updateQuantity = async(req, res) => {
        let cid = req.params.cid
        let pid = req.params.pid
        const quantityProd = req.body
        try{
            await CartService.updateQuantity(cid,pid, quantityProd)
            res.send('The quantity of the product has been changed.')
            logger.info('We changed the quantity of the product.')
        }
        catch(error){
            res.status(500).json('There is a problem with changing the quantity of this product.')
            logger.error('We could not change the quantity.')
        }
    }

    deleteAllFromCart = async(req, res) => {
        let cid = req.params.cid
        try{
            await CartService.deleteAllProdsInTheCart(cid)
            res.send('All products have been deleted.')
            logger.info('We deleted all the products from the cart.')
        }
        catch(error){
            res.status(500).json('There is an error with the cart.')
            logger.error('we could not delete the products from the cart')
        }
    }

    purchase = async(req, res) => {
        let cid = req.params.cid
        try{
            const notAvailable = []
            const findIdCart = await CartService.getCartById(cid)
            const prodsCart = findIdCart.products
            let totalPrice = 0
            for (const prod of prodsCart){
                const prodId = prod.product
                const findProd = await ProductService.findIdProd(prodId)
                const product = findProd[0]
                findProd.map(p => {
                    if(p.stock >= prod.quantity){
                        totalPrice += prod.quantity * product.price
                        p.stock -= prod.quantity
                        p.save()
                    }
                    else{
                        notAvailable.push({product: p, quantity: prod.quantity})
                    }
                })
                }

            if (totalPrice === 0) {
                return res.status(400).json({ error: 'No products available for purchase.' })
            }
            const cartUser = await usersModel.findOne({cart: cid})
            const getTicket = await ticketsModel.create({
                purchaser: cartUser.email,
                amount: totalPrice
            })
            await getTicket.save()
            await emailManager.sendEmailBuyCart(cartUser.email, cartUser.first_name, getTicket.code)

            const userCart = await CartService.findId(cid)
            userCart.products = notAvailable
            await userCart.save()

            res.send('You buy this cart.')
        }
        catch(error){
            res.status(500).json({ error: 'There is an error in the server.' })
        }
    }
}