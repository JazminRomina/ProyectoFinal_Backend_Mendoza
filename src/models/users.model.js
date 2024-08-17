import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String},
    email: {type: String, required: true, index: true, unique: true},
    password: {type: String},
    age: {type: Number},
    resetToken: {
        token: String,
        expire: Date
    },
    rol: {type: String},
    cart: {
        type: mongoose.Schema.Types.ObjectId
    },
    documents: [{
        _id: false,
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        default: Date.now
    }
},
{
    versionKey: false
})

const usersModel = mongoose.model("users", usersSchema)

export default usersModel