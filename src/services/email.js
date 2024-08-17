import nodemailer from 'nodemailer'

export class EmailManager{
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "jazminrominamm@gmail.com",
                pass: "qlzo lrcc przu lrij"
            }
        })
    }

    async sendEmailBuyCart(email, first_name, ticket){
        try{
            const mailOptions = {
                from: "App Coder Prueba <jazminrominamm@gmail.com>",
                to: email,
                subject: "Purchase confirmation",
                html: `
                    <h1> Purchase receipt </h1>
                    <p> Thanks for your purchase, ${first_name}!</p>
                    <p> The order number is: ${ticket} </p>
                `
            }
            await this.transporter.sendMail(mailOptions)
        }
        catch (error){
            console.log('failed')
        }
    }

    async sendEmailResetPass(email, first_name, token){
        const mailOptions = {
            from: "App Coder Prueba <jazminrominamm@gmail.com>",
            to: email,
            subject: "Password Change",
            html: `
                <h1> Change your password </h1>
                <p> Greetings ${first_name}! </p>
                <p> You asked for a change in your password, your confirmation code is: </p>
                <strong> ${token} </strong>
                <br>
                <a href="http://localhost:8080/reset-password"> Reset your password here </a>
                <p> This code expired in 1 hour.</p>
            `
        }
        await this.transporter.sendMail(mailOptions)
        console.log("error al enviar correo de restablecimiento")
    }

    async sendDeleteUser(first_name, email){
        try{
            const mailOptions = {
                from: "App Coder Prueba <jazminrominamm@gmail.com>",
                to: email,
                subject: "This account is gonna be delete because of inactivite",
                html: `
                    <h1> This accounts is deleted </h1>
                    <p> Greetings ${first_name}! </p>
                    <p> We did not see you on the last 2 days. That's why your account is not gonna exist anymore.</p>
                `
            }
            await this.transporter.sendMail(mailOptions)
        }
        catch(error){
            console.log("we could not send the email.")
        }
    }

    async sendDeleteProduct(email){
        try{
            const mailOptions = {
                from: "App Coder Prueba <jazminrominamm@gmail.com>",
                to: email,
                subject: "Your product has been deleted",
                html: `
                    <h1> Your Product is deleted </h1>
                    <p> We eliminated your product because why not?</p>
                `
            }
            await this.transporter.sendMail(mailOptions)
        }
        catch(error){
            console.log("we could not send the email.")
        }
    }

}

