import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "productos"

const productSchema = new mongoose.Schema({
    productTitle: { type: String, index: true, required: true },
    productDescription: { type: String, required: true },
    productCode: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    productStatus: { type: Boolean, required: true },
    productStock: { type: Number, required: true },
    productCategory: { type: String, required: true },
    productOwner: { type: String, default: "admin" },
    productImage: String
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel 