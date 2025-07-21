const express = require('express');
const router = express.Router();
const {getProfile, createProfile, updateProfile} = require('../controllers/userProfileController');
const verifyJWT = require('../middlewares/verifyJWT');

router.use(verifyJWT); 


router.get('/pro', getProfile);


router.post('/pro', createProfile);


router.put('/pro', updateProfile);

module.exports = router;
