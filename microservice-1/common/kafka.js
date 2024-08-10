const { Kafka } = require("kafkajs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const brokers = [process.env.BROKER_URL];
const topic = ["stock-price-update"];
const clientId = "stock-price-producer";
const sasl = {
  mechanism: "plain",
  username: process.env.KAFKA_USERNAME,
  password: process.env.KAFKA_PASSWORD,
};
const ssl = {
  rejectUnauthorized: true,
  ca: [fs.readFileSync(path.resolve(__dirname, "./ca.pem"), "utf-8")],
};

const kafka = new Kafka({
  topic,
  brokers,
  clientId,
  sasl,
  ssl,
  connectionTimeout: 3000,
  requestTimeout: 30000,
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("producer connected");
};

const disconnectProducer = async () => {
  await producer.disconnect();
  console.log("producer disconnected");
};

const produceMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

module.exports = {
  kafka,
  producer,
  produceMessage,
  disconnectProducer,
  connectProducer,
};
