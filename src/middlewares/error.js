import { Errors } from "../services/errors/enum.js"

const handleError = (error, req, res, next) => {
    console.log(error.cause)
    switch(error.code) {
        case Errors.TYPE_INVALID:
            res.send({status: "error", error: error.name})
            break
        default:
            res.send({status: "error", error: "Unknown error"})
    }
}
export default handleError