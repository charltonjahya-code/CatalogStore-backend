const db = require('../models');
const { NotFoundError } = require('../utils/errors');

async function getProfile(userId){

    const user = await db.User.findByPk(userId, { attributes: { exclude: ['password']}});

    if (!user){
        throw new NotFoundError('User not found');
    }

    return user;
}

module.exports = { getProfile };