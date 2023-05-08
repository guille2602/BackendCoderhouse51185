import mongoose from "mongoose";

const collection = 'messages';

const messagesSchema = new mongoose.Schema({
    date: Date,
    time: Date,
    method: String,
    description: String
})

const messageLogModel = mongoose.model(collection, messagesSchema);

export default messageLogModel;