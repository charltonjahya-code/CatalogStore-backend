const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1),      // non-empty string
  email: z.string().email(),     // valid email
  password: z.string().min(5),   // at least 5 chars
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),   // just needs to be present (non-empty)
});

module.exports = { registerSchema, loginSchema};