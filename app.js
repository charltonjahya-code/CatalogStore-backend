require('dotenv').config();
const express = require('express');
const db = require('./models');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(express.json());  

app.use(cors({
     origin: 'http://localhost:3000'
    }));

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

app.post('/register', async (req, res) => {
  try {
    // 1. get the submitted data from req.body

    const { name, email, password } = req.body;

    // 2. hash the password (bcrypt.hash, await it, saltRounds 10)

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create the user with the HASHED password (User.create)
    //    save password: hashedPassword, and role: 'user'

    const user = await db.User.create({ name, email, password: hashedPassword, role: 'user' });

    // 4. send back success — status 201, and the user WITHOUT the password
    res.status(201).json({ id: user.id, name: user.name, email: user.email });

  } catch (error) {
    // handle errors (duplicate email etc.) — status 400
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    // 1. get email and password from req.body
    const { email, password } = req.body;

    // 2. find the user by email (db.User.findOne)
    //    if no user found, respond 401 "invalid credentials"
    const user = await db.User.findOne({ where: { email } });
    if (!user) {                                              // ← ADD: no user found
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. compare the submitted password to the stored hash (bcrypt.compare)
    //    if it doesn't match, respond 401 "invalid credentials"
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {                                    // ← ADD: wrong password
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. password is correct → sign a JWT with the user's info
    //    jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' })
    const token = jwt.sign(
        { userId: user.id, role: user.role },   // payload: who they are
        process.env.JWT_SECRET,                  // your secret key (from .env)
        { expiresIn: '1h' }                      // token expires in 1 hour
    );

    // 5. send the token back
    res.json({ token });

  } catch (error) {
    // respond 500 server error
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = app;