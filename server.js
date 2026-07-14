const express = require('express');
const db = require('./models');
const cors = require('cors');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 3001;

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});