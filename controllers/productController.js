const productService = require('../services/productService');
const asyncHandler = require('../middleware/asyncHandler');

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
});

module.exports = { getAllProducts };