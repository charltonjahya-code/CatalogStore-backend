require('dotenv').config();
const db = require('./models');
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());  
app.use(cors({
     origin: 'http://localhost:3000'
    }));
app.use(authRoutes);

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

app.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/profile', authMiddleware, async (req, res) => {
  try {
    // 1. get the logged-in user's id from req.user (set by the middleware)
    const userId = req.user.userId;

    // 2. fetch that user from the database with findByPk
    const user = await db.User.findByPk(userId, { attributes: { exclude: ['password']}});

    // 3. if no user found → 404 "User not found" (return)
    if (!user){
        return res.status(404).json({ error: 'User not found' });
    }

    // 4. send back the user (res.json)
    res.json(user);

  } catch (error) {
    // 500 server error
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = app;