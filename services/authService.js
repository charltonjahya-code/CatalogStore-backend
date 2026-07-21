const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ConflictError } = require('../utils/errors');

async function register(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await db.User.create({ name, email, password: hashedPassword, role: 'user' });
    return { id: user.id, name: user.name, email: user.email };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Email already registered');   // translate to a clean 409
    }
    throw error;   // any OTHER error → re-throw it (let it bubble up as a 500)
  }
}

async function login(email, password){

    // 2. find the user by email (db.User.findOne)
    //    if no user found, respond 401 "invalid credentials"
    const user = await db.User.findOne({ where: { email } });

    if (!user) {                                              // ← ADD: no user found
        throw new UnauthorizedError('Invalid credentials');
    }

    // 3. compare the submitted password to the stored hash (bcrypt.compare)
    //    if it doesn't match, respond 401 "invalid credentials"
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {                                    // ← ADD: wrong password
      throw new UnauthorizedError('Invalid credentials');
    }

    // 4. password is correct → sign a JWT with the user's info
    //    jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' })
    const token = jwt.sign(
        { userId: user.id, role: user.role },   // payload: who they are
        process.env.JWT_SECRET,                  // your secret key (from .env)
        { expiresIn: '1h' }                      // token expires in 1 hour
    );

    return token;

}

module.exports = {register, login};