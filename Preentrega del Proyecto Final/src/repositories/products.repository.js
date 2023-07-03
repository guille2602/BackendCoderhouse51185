export class ProductsRepository {

    constructor(dao){
        this.dao = dao;
    }

    async readProducts(limit, sort){
        const payload = this.dao.readProducts(limit, sort)
        return payload;
    }

    async readProduct(prodId){
        const payload = this.dao.readProduct(prodId);
        return payload;
    }

    async addProduct(product){
        const payload = this.dao.addProduct(product);
        return payload;
    }

    async updateProduct(productId, updatedInfo){
        const payload = this.dao.updateProduct(productId, updatedInfo);
        return payload;
    }

    async deleteProduct(productId){
        const payload = this.dao.deleteProduct(productId);
        return payload;
    }

    async paginateContent(limit, sort, page, query){
        const payload = this.dao.paginateContent(limit, sort, page, query);
        return payload;
    }

    async updateStock( products ) {
        const payload = this.dao.updateStock( products )
        return payload;
    }
    
}