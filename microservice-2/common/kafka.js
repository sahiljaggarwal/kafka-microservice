const { Kafka } = require("kafkajs");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");
require("dotenv").config();

const eventEmitter = new EventEmitter();

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
  // topic,
  brokers,
  clientId,
  sasl,
  ssl,
  connectionTimeout: 3000,
  requestTimeout: 30000,
});

const consumer = kafka.consumer({ groupId: "stock-api-group" });

const messageCreatedHandler = (data) => {
  console.log("Got a new message ", JSON.stringify(data, null, 2));
  eventEmitter.emit("recieved", data);
};

const topicToSubscribe = {
  "stock-price-update": messageCreatedHandler,
};

const connectConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Connected to consumer");

    // for (let i = 0; i < topicToSubscribe.length; i++) {
    //   await consumer.subscribe({
    //     topic: topic[i],
    //     fromBeginning: true,
    //   });
    // }
    consumer.subscribe({
      topic: "stock-price-update",
      fromBeginning: true,
    });
    console.log("Subscribed to topic");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message || !message.value) {
          console.log("No message or value");
          return;
        }
        console.log("line ", 59, message);

        try {
          const data = JSON.parse(message.value.toString());
          console.log("Received message data: ", data);
          const handler = topicToSubscribe[topic];

          if (handler) {
            handler(data); // Call the handler directly
          }
        } catch (error) {
          console.error("Error parsing message: ", error);
        }
      },
    });
  } catch (error) {
    console.log("consumer connection error ", error);
    throw new Error("failed to connect with consumer kafka");
  }
};

const disconnectConsumer = async () => {
  await consumer.disconnect();
  console.log("Disconnected from consumer");
};

module.exports = { connectConsumer, disconnectConsumer, eventEmitter };
