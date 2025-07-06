const UserProfile = require('../models/UserProfile');
const { logInfo, logError } = require('../utils/logger');

// Crear nuevo perfil
async function createProfile(data) {
  const { userId, name, email, bio } = data;

  if (!userId || !name || !email) {
    throw { status: 400, message: 'userId, name y email son obligatorios.' };
  }

  const existing = await UserProfile.findOne({ userId });
  if (existing) {
    throw { status: 409, message: 'Perfil ya existe para este usuario.' };
  }

  const profile = new UserProfile({ userId, name, email, bio });
  await profile.save();

  logInfo('✅ Perfil creado', profile);
  return profile;
}

// Obtener perfil
async function getProfileByUserId(userId) {
  const profile = await UserProfile.findOne({ userId });
  if (!profile) {
    throw { status: 404, message: 'Perfil no encontrado.' };
  }

  logInfo('📄 Perfil encontrado', profile);
  return profile;
}

// Actualizar perfil
async function updateProfile(userId, updates) {
  const updatedProfile = await UserProfile.findOneAndUpdate(
    { userId },
    updates,
    { new: true }
  );

  if (!updatedProfile) {
    throw { status: 404, message: 'Perfil no encontrado.' };
  }

  logInfo('✏️ Perfil actualizado', updatedProfile);
  return updatedProfile;
}

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfile
};
