
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 
const profileRoutes = require('./routes/userProfileRoutes'); 
const { startUserRegisteredConsumer } = require('./events/consumer'); 

const app = express();


const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://54.225.75.133:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());


connectDB();


app.use('/api/profiles', profileRoutes);


app.get('/', (_, res) => res.send('✅ ms-user-profile activo'));


app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


app.use((err, req, res, next) => {
  console.error('❌ Error general:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});


const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor ms-user-profile corriendo en puerto ${PORT}`);

  
  try {
    await startUserRegisteredConsumer();
    console.log('📥 Consumer user.registered iniciado');
  } catch (err) {
    console.error('❌ Error al iniciar el consumer RabbitMQ:', err.message);
  }
});
