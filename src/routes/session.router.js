import express from 'express'
import passport from 'passport'
import { SessionsController } from '../controllers/session.controller.js'

const router = express.Router()
const sessionController = new SessionsController()

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), sessionController.authenticateLog)
router.get("/faillogin", sessionController.failedLog)
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), sessionController.gitLogAuthenticate)
router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), sessionController.gitLogAuthenticate)
router.get("/logout", sessionController.logout)

export default router