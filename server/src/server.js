const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const { loadPlanetsData } = require("./models/planets.model");
const app = require("./app");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
