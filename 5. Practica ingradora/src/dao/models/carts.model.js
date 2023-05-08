import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: [{
        product: String,
        quantity: Number
    }]
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;