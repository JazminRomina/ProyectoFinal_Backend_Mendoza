import { generateToken } from "../utils/tokenreset.js"
import { EmailManager } from "../services/email.js"
import usersModel from "../models/users.model.js"
import { createHash, isValidPassword } from "../utils/hashbcrypt.js"

const emailManager = new EmailManager()

export class UsersController{
    registerAuthenticate = async(req, res) => {
        if(!req.user){
            return res.status(400).send("Invalid credentials")
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol,
            cart: req.user.cart,
        }
        req.session.login = true
        res.redirect("/profile")
    }

    failedRegister = (req, res) => {
        res.send("There is a problem with the page!")
    }

    requestPasswordReset = async(req, res) => {
        const {email} = req.body
        try{
            const user = await usersModel.findOne({email})
            if(!user){
                return res.status(404).send("User not found")
            }
            const token = generateToken()
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }
            await user.save()
            await emailManager.sendEmailResetPass(email, user.first_name, token)
            res.render("confirmacion-envio")
        }
        catch(error){
            res.status(500).send("Error in the server.")
        }
    }

    resetPassword = async(req, res) => {
        const {email, password, token} = req.body
        try{
            const user = await usersModel.findOne({email})
            if(!user){
                return res.render("resetpass", {error: "user not found."})
            }
            const resetToken = user.resetToken
            if(!resetToken || resetToken.token !== token){
                return res.render("getemailpass", {error: "The token is invalid."})
            }
            const fecha = new Date()
            if(fecha > resetToken.expire){
                return res.render("getemailpass", {error: "The token has expired."})
            }
            if(isValidPassword(password, user)){
                return res.render("resetpass", {error: "The new password cannot be the same as the old one."})
            }

            user.password = createHash(password)
            user.resetToken = undefined
            await user.save()

            return res.redirect("/login")
        }
        catch(error){
            res.status(500).send("Error in the server.")
        }
    }

    changeRolPremium = async(req, res) => {
        const {uid} = req.params
        try {
            const user = await usersModel.findById(uid)
            if(!user) {
                return res.status(404).send("User not found")
            }
            const documentationNeedIt = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"]
            const userDocuments = user.documents.map(doc => doc.name.split('.').slice(0, -1).join('.'))
            const checkDocuments = documentationNeedIt.every(doc => userDocuments.includes(doc))
            if(!checkDocuments){
                return res.status(404).send("You don't have the documents to be a Premium user.")
            }
            const newRol = user.rol === "User" ? "Premium" : "User"
            const updateRol = await usersModel.findByIdAndUpdate(uid, {rol: newRol})
            res.json(updateRol)
        } catch (error) {
            res.status(500).send("There is an error in the server.")
        }
    }

    documentationToChangeRol = async(req, res) => {
        const {uid} = req.params
        const uploadedDocuments = req.files
        try{
            const user = await usersModel.findById(uid)
            if(!user) {
                return res.status(404).send("User not found")
            }
            if(uploadedDocuments){
                if (uploadedDocuments.document){
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                if (uploadedDocuments.products){
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                if (uploadedDocuments.profile){
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
                await user.save()
                res.status(200).send("We upload the documents.")
            }
        }
        catch(error){
            res.status(500).send("There is an error in the server.")
        }
        }

    getUsers = async(req, res) => {
        try{
            const users = await usersModel.find({}, 'first_name last_name email rol')
            res.status(201).send(users)
        }
        catch(error){
            res.status(500).send("There is an error in the server.")
        }
    }

    deleteUsers = async(req, res) => {
        try{
            const inactiveSince = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            const inactiveUsers = await usersModel.find({ last_connection: { $lt: inactiveSince } })
            for (const user of inactiveUsers){
                await emailManager.sendDeleteUser(user.first_name, user.email)
                await usersModel.deleteOne({ _id: user._id })
            }
            res.status(200).send("Inactive users deleted.")
        }
        catch(error){
            res.status(404).send("There is an error and we could not delete the inactive users.")
        }
    }

    deleteOneUser = async(req, res) => {
        const { uid } = req.params
        try{
            const user = await usersModel.findByIdAndDelete(uid)
            if (!user) {
                return res.status(404).send("User not found.")
            }
            await emailManager.sendDeleteUser(user.first_name, user.email)
            res.status(200).send("User deleted successfully.")
        }
        catch(error){
            res.status(500).send("There is an error and we could not delete the user.")
        }
    }
}