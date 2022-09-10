const mongoose = require ("mongoose");

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
},{collection: 'products'});

const productModel = mongoose.model('Products', productSchema);
module.exports = productModel;