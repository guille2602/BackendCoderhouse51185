import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }],
        default: []
    }
})

cartsSchema.pre('findOne', function (){
    this.populate('products.product')
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;