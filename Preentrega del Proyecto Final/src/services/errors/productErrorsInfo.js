export const generateProductErrorInfo = (product) => {
    return `
    Alguno de los campos requeridos no superó la validacion:
    title: Tipo String / Se recibió: ${product.title}
    description: Tipo String / Se recibió: ${product.description}
    code: Tipo String / Se recibió: ${product.code}
    price: Tipo Number / Se recibió: ${product.price}
    status: Tipo Boolean / Se recibió: ${product.status}
    stock: Tipo String / Se recibió: ${product.stock}
    category: Tipo String / Se recibió: ${product.category}
    `
}

export const generateProductErrorParams = ( productId ) => {
    return `
    El id no es válido, se esperaba ObjectId / Se recibió: ${productId}
    `
}

