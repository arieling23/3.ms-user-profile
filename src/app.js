// app.js
require('dotenv').config(); // Carga variables de entorno

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); // Renombrado a database.js por claridad
const profileRoutes = require('./routes/userProfileRoutes'); // ✅ Cambiado desde preferencesRoutes
const { startUserRegisteredConsumer } = require('./events/consumer'); // ✅ Si usas RabbitMQ

const app = express();

// Configuración CORS desde variable de entorno
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://54.225.75.133:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas protegidas (todas las rutas en userProfileRoutes ya usan verifyJWT)
app.use('/api/profiles', profileRoutes); // ✅ Ruta base clara

// Ruta raíz de prueba
app.get('/', (_, res) => res.send('✅ ms-user-profile activo'));

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error general:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor ms-user-profile corriendo en puerto ${PORT}`);

  // Arrancar el consumer de eventos si aplica
  try {
    await startUserRegisteredConsumer();
    console.log('📥 Consumer user.registered iniciado');
  } catch (err) {
    console.error('❌ Error al iniciar el consumer RabbitMQ:', err.message);
  }
});
