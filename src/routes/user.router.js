import express from 'express'
import passport from 'passport'
import { UsersController } from '../controllers/users.controller.js'
import { upload } from '../middlewares/multer.js'

const userController = new UsersController()
const router = express.Router()

router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), userController.registerAuthenticate)
router.get("/failedregister", userController.failedRegister)
router.post('/reset-password', userController.resetPassword)
router.post('/requestPasswordReset', userController.requestPasswordReset)
router.put('/premium/:uid', userController.changeRolPremium)
router.post('/:uid/documents', upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), userController.documentationToChangeRol)
router.get("/", userController.getUsers)
router.delete("/", userController.deleteUsers)
router.delete("/deleteUser/:uid", userController.deleteOneUser)

export default router