import { ProductService } from "../services/products.service.js"
import { getProductsFaker } from "../utils/faker.js"
import customError from "../services/errors/custom-error.js"
import generateErrorProds from "../services/errors/infoProds.js"
import { Errors } from "../services/errors/enum.js"
import { logger } from "../utils/logger.js"
import { EmailManager } from "../services/email.js"
import productsModel from "../models/products.model.js"
const emailManager = new EmailManager()

export class ProductsController {
    prods = async(req, res) => {
        try{
            const products = await ProductService.getAllProdsViews(req)
            res.status(200).json(products.response)
            logger.info('Showing the products')
        }
        catch(error){
            res.status(500).send("There is an error with the server.")
            logger.error('We could not find the products.')
        }
    }

    findId = async(req, res) => {
        let pid = req.params.pid
        try{
            const findProd = await ProductService.findIdProd(pid)
            res.status(200).json(findProd)
            logger.info('We find the ID of the product.')
        }
        catch(error){
            res.status(500).send("There is an error with the server.")
            logger.error('There is an error with the ID / Item not Found.')
        }
    }

    addProd = async(req, res, next) => {
        try{
            const newProduct = req.body
            if(typeof newProduct.price !== "number" || typeof newProduct.stock !== "number"){
                return res.status(500).json('Stock or price variable is not a number.')
            }
            if(!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock || !newProduct.status || !newProduct.category){
                throw customError.createError({
                    name: "New Product",
                    cause: generateErrorProds({newProduct}),
                    message: "Error al intentar crear un producto",
                    code: Errors.TYPE_INVALID
                })
            }
            const product = await ProductService.addProducts(newProduct)
            res.status(200).send({message: 'This Product has been added', product: product})
        }
        catch(error){
            next(error)
        }
    }

    changeProd = async(req, res) => {
        let pid = req.params.pid
        const prod = req.body
        try{
            const prodChange = await ProductService.updateProd(pid, prod)
            res.status(200).send({message: 'This Product has been changed', product: prodChange})
            logger.info('We changed some things in the product.')
        }
        catch(error){
            res.status(500).send("There is an error with the server.")
            logger.error('We could not change the product.')
        }
    }

    deleteProd = async(req, res) => {
        let pid = req.params.pid
        try{
            const product = await productsModel.findById(pid)
            const isPremium = product.owner !== "Admin"
            if (!product) {
                return res.status(404).send('Product not found')
            }
            if(isPremium){
                await emailManager.sendDeleteProduct(product.owner)
            }
            const delProduct = await ProductService.deleteProduct(pid)
            res.status(200).send({message: 'This Product has been eliminated', product: delProduct})
            logger.error('We eliminated the product.')
        }
        catch(error){
            res.status(500).send("There is an error with the server.")
            logger.error('We could not delete the product.')
        }
    }

    mocks = (req, res) => {
        const products = []
        try{
            for(let i = 0; i < 100; i++){
                products.push(getProductsFaker())
            }
            res.status(200).json(products)
        }
        catch(error){
            res.status(500).json({message: 'We could not get faker products.'})
        }
    }
}