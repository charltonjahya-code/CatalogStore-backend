const db = require('../models');

async function getAllProducts(){
    const products = await db.Product.findAll();
    return products;
}

module.exports = { getAllProducts };