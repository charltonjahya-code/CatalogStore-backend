const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register(name, email, password);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  res.json({ token });
});

module.exports = {register, login};