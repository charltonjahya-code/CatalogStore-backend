require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());  
app.use(cors({
     origin: 'http://localhost:3000'
    }));
app.use(authRoutes);
app.use(productRoutes);
app.use(userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! The server is alive.')
});

module.exports = app;