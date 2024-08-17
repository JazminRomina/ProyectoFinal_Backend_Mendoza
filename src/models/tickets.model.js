import mongoose from "mongoose"
import { v4 as uuidv4 } from "uuid"

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: function() {
            return uuidv4()
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {type: Number, required: true},
    purchaser: {
        type: String,
        required: true
    },
},
{
    versionKey: false
})

const ticketsModel = mongoose.model("tickets", ticketsSchema)

export default ticketsModel