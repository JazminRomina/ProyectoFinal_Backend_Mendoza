const generateError = (user) => {
    return `There are incomplete or invalid data, we need to receive the following data:
    * First_name: String, but we received: ${user.first_name}
    * Last_name: String, but we received: ${user.last_name}
    * Email: String, but we received: ${user.email}`
}

export default generateError