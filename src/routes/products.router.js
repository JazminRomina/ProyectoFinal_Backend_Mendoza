import express from 'express'
import { ProductsController } from '../controllers/products.controller.js'

const ProdsController = new ProductsController()
const router = express.Router()

router.get('/', ProdsController.prods)
router.get('/:pid', ProdsController.findId)
router.post('/', ProdsController.addProd)
router.put('/:pid', ProdsController.changeProd)
router.delete('/:pid', ProdsController.deleteProd)
router.get('/test/mockingproducts', ProdsController.mocks)

export default router