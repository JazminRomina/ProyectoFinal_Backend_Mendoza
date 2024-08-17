const generateErrorProds = ({newProduct}) => {
    return `There are incomplete or invalid data, we need to receive the following data:
    * title: String, but we received: ${newProduct.title}
    * description: String, but we received: ${newProduct.description}
    * price: Number, but we received: ${newProduct.price}
    * thumbnail: String, but we received: ${newProduct.thumbnail}
    * code: String, but we received: ${newProduct.code}
    * stock: Number, but we received: ${newProduct.stock}
    * status: Boolean, but we received: ${newProduct.status}
    * category: String, but we received: ${newProduct.category}`
}

export default generateErrorProds
