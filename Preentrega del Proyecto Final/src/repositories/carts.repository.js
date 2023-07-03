export class CartsRepository {

    constructor(dao){
        this.dao = dao;
    }

    async createCart(){
        const payload = await this.dao.createCart();
        return payload;
    }

    async readCart(id){
        const payload = await this.dao.readCart(id);
        return payload;
    }

    async insertManyInCart(cartId, products){
        const payload = await this.dao.insertManyInCart(cartId, products);
        return payload;
    }

    async addToCart(cartId, prodId){
        const payload = await this.dao.addToCart(cartId, prodId);
        return payload;
    }

    async updateCart(cartId, prodId, quantity){
        const payload = await this.dao.updateCart(cartId, prodId, quantity);
        return payload;
    }

    async deleteProduct(cartId, prodId){
        const payload = await this.dao.deleteProduct(cartId, prodId);
        return payload;
    }

    async emptyCart(cartId){
        const payload = await this.dao.emptyCart(cartId);
        return payload;
    }

}