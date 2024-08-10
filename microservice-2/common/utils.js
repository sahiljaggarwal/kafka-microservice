const { disconnectConsumer } = require("./kafka");

const gracefullShutdown = async (server) => {
  server.close();
  await disconnectConsumer();
  console.log("gracefull shutdown....");
  process.exit(0);
};

module.exports = { gracefullShutdown };
