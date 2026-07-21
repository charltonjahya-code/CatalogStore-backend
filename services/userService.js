const db = require('../models');

async function getProfile(userId){

    const user = await db.User.findByPk(userId, { attributes: { exclude: ['password']}});

    if (!user){
        throw new Error('User not found');
    }

    return user;
}

module.exports = { getProfile };