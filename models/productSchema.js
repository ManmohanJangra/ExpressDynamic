const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Name is required"],
  },
  productPrice: {
    type: Number,
  },
  productRating: {
    type: String,
  },
  productDiscription: {
    type: Number,
  },
});

const productCollection = mongoose.model("productCollect", productSchema);

module.exports = { productCollection };
