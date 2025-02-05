import amqp from "amqplib";
import express from "express";

const app = express();

app.use(express.json());

app.post("/messages/:queue", async (req, res) => {
  const { queue } = req.params;
  const { message } = req.body;

  try {
    // 1. Conectar a RabbitMQ
    const rabbitOptions = {
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin",
    };
    const connection = await amqp.connect(rabbitOptions);

    // 2. Crear un canal
    const channel = await connection.createChannel();

    // 3. Declarar la cola
    await channel.assertQueue(queue);

    // 4. Enviar el mensaje
    channel.sendToQueue(queue, Buffer.from(message));

    // 5. Cerrar la conexión después de medio segundo
    setTimeout(() => {
      connection.close();
    }, 500);

    return void res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    return void res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
