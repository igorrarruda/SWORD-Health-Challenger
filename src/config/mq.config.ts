import { Options } from "amqplib";
import { MQ_PASSWORD, MQ_PORT, MQ_URL, MQ_USER } from "./const.config";

export const mqConnection: Options.Connect = {
  protocol: 'amqp',
  hostname: MQ_URL,
  port: Number(MQ_PORT),
  username: MQ_USER,
  password: MQ_PASSWORD
}
