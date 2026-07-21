const userService = require('../services/userService');

async function getProfile(req, res) {
    try {
        const userId = req.user.userId;
        const userProfile = await userService.getProfile(userId);
        res.json(userProfile);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = { getProfile };