const amqp = require('amqplib');
const UserProfile = require('../models/UserProfile');

async function startUserRegisteredConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Asegúrate de declarar el exchange user como topic
  await channel.assertExchange('user', 'topic', { durable: true });

  //2Declara y vincula la cola
  const queue = 'user.registered.profile';
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, 'user', 'user.registered');

  console.log('📥 [PROFILE] Escuchando en cola', queue);

  
  channel.consume(queue, async (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());
    const { id, name, email } = event.data;

    const existing = await UserProfile.findOne({ userId: id });
    if (existing) {
      console.log(`ℹ️ Perfil ya existe para usuario: ${id}`);
      return channel.ack(msg);
    }

    const newProfile = new UserProfile({ userId: id, name, email });
    await newProfile.save();
    console.log('✅ Perfil creado para usuario:', id);
    channel.ack(msg);
  });
}

module.exports = { startUserRegisteredConsumer };
