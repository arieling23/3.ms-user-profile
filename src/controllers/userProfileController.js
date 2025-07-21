
const UserProfile = require('../models/UserProfile');


const getProfile = async (req, res) => {
  try {
    console.log('🟡 [GET PROFILE] req.user:', req.user);
    console.log('🟡 [GET PROFILE] req.headers.authorization:', req.headers.authorization);

    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ message: 'ID de usuario no proporcionado.' });

    const profile = await UserProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Perfil no encontrado' });

    res.json(profile);
  } catch (err) {
    console.error('❌ Error al obtener el perfil:', err);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const createProfile = async (req, res) => {
  try {
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.body:', req.body);

    const existing = await UserProfile.findOne({ userId: req.user.userId });
    if (existing) return res.status(409).json({ message: 'Perfil ya existe' });

    const newProfile = new UserProfile({
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      bio: '',
      avatarUrl: '',
      phone: '',
    });

    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    console.error('❌ Error al crear perfil:', err);
    res.status(500).json({ message: 'Error al crear perfil' });
  }
};


const updateProfile = async (req, res) => {
  try {
    console.log('🔧 Actualizando perfil:', req.body);

    const profile = await UserProfile.findOne({ userId: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (req.body.bio !== undefined) profile.bio = req.body.bio;
    if (req.body.phone !== undefined) profile.phone = req.body.phone;

    await profile.save(); 
    console.log('✅ Perfil actualizado:', profile);

    res.json(profile);
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};
