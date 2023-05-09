import mongoose from "mongoose";

const collection = 'messages';

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true},
    message: {
        type: String,
        required: true
    }
})

const messageModel = mongoose.model(collection, messagesSchema);

export default messageModel;