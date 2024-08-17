import { faker } from "@faker-js/faker"

export const getProductsFaker = () => {
    return{
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.finance.routingNumber(),
        stock: faker.number.int({ min: 10, max: 100 }),
        status: true,
        category: faker.commerce.productMaterial()
    }
}