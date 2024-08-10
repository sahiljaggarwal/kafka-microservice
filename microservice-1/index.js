const express = require("express");
const app = express();
const EventEmitter = require("node:events");
const http = require("http");
const { gracefullShutdown } = require("./common/utils");
const { connectProducer, produceMessage } = require("./common/kafka");
const { Stock, stocks } = require("./common/stocks");
require("dotenv").config();

const eventEmitter = new EventEmitter();
const server = http.createServer(app);

let producerConnected = false;

const startProducing = () => {
  setInterval(async () => {
    try {
      console.log("Update Stock Data...");
      stocks.forEach((stock) => stock.updatePrice());
      const stocksData = stocks.map((stock) => stock.toJSON());
      eventEmitter.emit("price-updated", { data: stocksData });

      if (producerConnected) {
        await produceMessage("stock-price-update", stocksData);
      } else {
        console.log("Producer is not connected, unable to produce messages.");
      }
    } catch (error) {
      console.error("Error producing message:", error);
    }
  }, 1000);
};

// Server Code
(async () => {
  try {
    await connectProducer();
    producerConnected = true;

    server.listen(process.env.PORT, "0.0.0.0", () => {
      console.log("producer server is running on port: ", process.env.PORT);
    });

    startProducing();

    const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];
    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      process.on(signal, () => {
        gracefullShutdown(server);
      });
    }
  } catch (error) {
    console.log("server error", error);
  }
})();
