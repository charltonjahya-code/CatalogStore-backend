const express = require('express');
const db = require('./models');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello World! The server is alive.')
});

app.get('/products', async (req, res) => {
  try {
    // 1. fetch all products (await db.Product.findAll())
    const products = await db.Product.findAll();
    // 2. send them back (res.json(...))
    res.json(products);
  } catch (error) {
    // send an error: res.status(500).json({ error: 'something' })
    res.status(500).json({error: 'server error'});
  }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});