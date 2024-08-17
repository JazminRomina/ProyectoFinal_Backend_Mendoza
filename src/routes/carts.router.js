import express from 'express'
import { CartsController } from '../controllers/cart.controller.js'

const cartController = new CartsController()
const router = express.Router()

router.post('/', cartController.newCart)
router.get('/:id', cartController.cartIdFound)
router.post('/:cid/product/:pid', cartController.addProdtotheCart)
router.delete('/:cid/products/:pid', cartController.deleteProdFromCart)
router.put('/:cid', cartController.updateProdCart)
router.put('/:cid/products/:pid', cartController.updateQuantity)
router.delete('/:cid', cartController.deleteAllFromCart)
router.post('/:cid/purchase', cartController.purchase)
export default router