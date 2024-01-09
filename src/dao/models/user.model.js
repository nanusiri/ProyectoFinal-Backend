import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'


const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    profile_image: String,
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carts"
    },
    resetToken: { type: String, maxlength: 1000 },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    },
    last_connection: String
});

userSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(userCollection, userSchema)

export default userModel 