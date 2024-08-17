import usersModel from "../models/users.model.js"

export class SessionsController{
    authenticateLog = async (req, res) => {
            if (!req.user) {
                return res.status(400).send("Invalid credentials")
            }
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                email: req.user.email,
                rol: req.user.rol,
                cart: req.user.cart
            }
            const user = req.user
            const findUser = await usersModel.findOne(user)
            findUser.last_connection = new Date()
            await findUser.save()
            req.session.login = true
            res.redirect("/profile")
        }

    failedLog = async (req, res) => {
        res.send("There is a problem with the page!")
    }

    gitLogAuthenticate = async (req, res) => {
        const user = req.user
        const findUser = await usersModel.findOne(user)
        findUser.last_connection = new Date()
        await findUser.save()
            req.session.user = user
            req.session.login = true
            res.redirect("/profile")
        }

    logout = async(req, res) => {
        if(req.session.login){
            const user = req.user
            const findUser = await usersModel.findOne(user)
            findUser.last_connection = new Date()
            await findUser.save()
            req.session.destroy()
        }
        res.redirect("/login")
    }
}