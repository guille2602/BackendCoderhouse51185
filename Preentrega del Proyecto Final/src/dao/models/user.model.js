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
    documents: [{
        name: {
                type: String,
                required: true
            },
        reference: {
            type: String,
            required: true
        }
    }],
    last_connection: {
        type: Date,
        default: null
    },
    status:{
        type:String,
        required:true,
        enums:["completo","incompleto","pendiente"],
        default:"pendiente"
    },
    avatar: {
        type: String,
        default: ""
    }
});

userSchema.pre("findOne", function () {
    this.populate("cart");
});

const userModel = mongoose.model(collection, userSchema);

export default userModel;
