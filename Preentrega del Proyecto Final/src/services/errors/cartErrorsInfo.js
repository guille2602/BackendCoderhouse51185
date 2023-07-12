export const generateUpdateCartErrorInfo = (products) => {
    let  message = "";
    products.forEach(item=>{
        message += `Product: ${item.product._id} - Quantity: ${item.quantity}
    `})
    return `
    Se esperaba array del tipo [{product: ObjectId, quantity: Number}] / Se recibió: 
    ${ message }
    `
}

export const generateCartErrorParams = ( productId ) => {
    return `
    El id no es válido, se esperaba ObjectId / Se recibió: ${productId}
    `
}

export const generateCartOrProductErrorParams = ( cartId, productId ) => {
    return `
    El id no es válido: 
    Se esperaba en Cart ObjectId / Se recibió: ${cartId}
    Se esperaba en Product ObjectId / Se recibió: ${productId}
    `
}

export const generateProdsQuantityErrorParams = ( quantity ) => {
    return `
    No se ha ingresado una cantidad de productos a actualizar en el carrito
    Se esperaba una cantidad / Se recibio: ${quantity}
    `
}

export const generateCartNotFoundError = (cartId) => {
    return `
    No se ha encontrado carrito asociado al id enviado: ${cartId}
    `
}