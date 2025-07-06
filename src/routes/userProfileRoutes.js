const express = require('express');
const router = express.Router();
const {getProfile, createProfile, updateProfile} = require('../controllers/userProfileController');
const verifyJWT = require('../middlewares/verifyJWT');

router.use(verifyJWT); // Todas las rutas protegidas

// GET /user-profiles/:userId
router.get('/pro', getProfile);

// POST /user-profiles
router.post('/pro', createProfile);

// PUT /user-profiles/:userId
router.put('/pro', updateProfile);

module.exports = router;
