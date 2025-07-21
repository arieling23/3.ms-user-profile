
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();

  
  await channel.assertExchange('user', 'topic', { durable: true });
  console.log('📡 Conectado a RabbitMQ (Exchange: user)');
}

function publishEvent(routingKey, data) {
  if (!channel) {
    throw new Error('⚠️ Canal RabbitMQ no inicializado');
  }

  
  channel.publish('user', routingKey, Buffer.from(JSON.stringify(data)), {
    contentType: 'application/json',
    persistent: true
  });

  console.log(`📤 Evento publicado: ${routingKey}`);
}

module.exports = {connectRabbitMQ, publishEvent};
