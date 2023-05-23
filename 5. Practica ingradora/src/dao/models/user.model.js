import mongoose from "mongoose";

const collection = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
})

const userModel = mongoose.model(collection, userSchema);

export default userModel;