import Rabbitmq from "./integrations/rabbitmq.integration";
import App from "./app";

const app = new App();

const consumer = async () => {
  const server = new Rabbitmq();
  await server.start();
  await server.consume('PERFORMED_TASK', (message) => console.log(message.content.toString()));
}

consumer();

app.listen();