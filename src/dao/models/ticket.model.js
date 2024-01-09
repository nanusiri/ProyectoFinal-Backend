import mongoose from "mongoose";

const ticketCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    purchase_datetime: { type: String },
    amount: { type: Number },
    purchaser: { type: String },
    unpurchasedProducts: {
        type: [
            {
                producto: { type: String }
            }
        ],
        default: []
    }
})

ticketSchema.pre('save', async function (next) {
    if (!this.code) {
        this.code = Math.random().toString(36).substring(2, 12)
    }
    this.purchase_datetime = new Date().toISOString()
    next();
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel