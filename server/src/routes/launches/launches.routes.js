const express = require("express");
const {
  httpGetAllLaunches,
  httpGetHistoryLaunches,
  httpGetUpcomingLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.get("/history", httpGetHistoryLaunches);
launchesRouter.get("/upcoming", httpGetUpcomingLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
