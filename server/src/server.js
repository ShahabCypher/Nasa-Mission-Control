const http = require("http");
require("dotenv").config();

const { loadPlanetsData } = require("./models/planets.model");
const app = require("./app");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
