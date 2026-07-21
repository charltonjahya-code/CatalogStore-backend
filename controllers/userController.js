const userService = require('../services/userService');
const asyncHandler = require('../middleware/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const userProfile = await userService.getProfile(userId);
    res.json(userProfile);
});

module.exports = { getProfile };