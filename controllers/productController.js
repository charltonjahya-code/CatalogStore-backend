const productService = require('../services/productService');

async function getAllProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch(error){
        res.status(500).json({ error: 'Server error'});
    }
}

module.exports = { getAllProducts };