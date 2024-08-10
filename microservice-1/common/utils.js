const { disconnectProducer } = require("../common/kafka");

const gracefullShutdown = async (server) => {
  server.close();
  await disconnectProducer();
  console.log("gracefull shutdown....");
  process.exit(0);
};

module.exports = { gracefullShutdown };
