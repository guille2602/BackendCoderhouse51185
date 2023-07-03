import mongoose from "mongoose";

const collection = 'tickets';
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: {
        type: String
    }
})

const ticketModel = mongoose.model(collection, ticketSchema);

export default ticketModel;