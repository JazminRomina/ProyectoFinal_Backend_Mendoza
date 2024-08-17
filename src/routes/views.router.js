import express from 'express'
import { ViewsController } from '../controllers/views.controller.js'
import { rolAuthenticationAdmin } from '../middlewares/middlewares.js'
import { rolAuthenticationUser } from '../middlewares/middlewares.js'

const router = express.Router()
const viewController = new ViewsController()

router.get('/', viewController.allProdsRender)
router.get('/realtimeproducts', rolAuthenticationAdmin ,viewController.realTimeProds)
router.get('/chat', rolAuthenticationUser , viewController.chat)
router.get('/products', viewController.getProdsForView)
router.get('/carts/:cid', viewController.cartRender)
router.get('/login', viewController.login)
router.get('/register', viewController.register)
router.get('/profile', viewController.profile)
router.get('/loggertest', viewController.logger)
router.get('/requestPasswordReset', viewController.renderEmailPass)
router.get('/reset-password', viewController.renderResetPass)
router.get('/confirmacion-envio', viewController.renderConfirmationEmail)
router.get('/changeRol-deleteUser', viewController.renderChangeDelete)

export default router