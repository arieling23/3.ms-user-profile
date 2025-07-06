// src/events/publisher.js
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();

  // ✅ Declaramos un exchange tipo topic llamado 'user'
  await channel.assertExchange('user', 'topic', { durable: true });
  console.log('📡 Conectado a RabbitMQ (Exchange: user)');
}

function publishEvent(routingKey, data) {
  if (!channel) {
    throw new Error('⚠️ Canal RabbitMQ no inicializado');
  }

  // ✅ Enviamos el mensaje al exchange con opciones adicionales
  channel.publish('user', routingKey, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    persistent: true
  });

  console.log(`📤 Evento publicado: ${routingKey}`);
}

module.exports = {connectRabbitMQ, publishEvent};
