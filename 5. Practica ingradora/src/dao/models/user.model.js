import mongoose from "mongoose";

const collection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        index: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    role: { 
        type: String, 
        default: "user"
    },
});

userSchema.pre("findOne", function () {
    this.populate("cart");
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
