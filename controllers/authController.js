const authService = require('../services/authService');

async function register(req, res){
    try {
        const { name, email, password } = req.body;
        const result = await authService.register(name, email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
}

async function login(req, res){
  try {
    // 1. read plain values out of req.body
    const { email, password } = req.body;

    // call the service with plain values
    const token = await authService.login(email, password);

    // 5. send the response
    res.json({ token });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = {register, login};