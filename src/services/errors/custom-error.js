class customError{
    static createError({name = "Error", cause = "Unknown", message, code = 1}){
        const error = new Error(message)
        error.name = name
        error.cause = cause
        error.code = code

        throw error
    }
}

export default customError