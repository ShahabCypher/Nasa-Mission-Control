const {
  getAllLaunches,
  getHistoryLaunches,
  getUpcomingLaunches,
  getHistoryLaunchesCount,
  getUpcomingLaunchesCount,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const result = await getAllLaunches(skip, limit);

  if (limit) {
    return res.status(200).json({
      launches: result.launches,
      total: result.total,
      page: Math.floor(skip / limit) + 1,
      limit: limit,
    });
  }

  return res.status(200).json(result);
};

const httpGetHistoryLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const result = await getHistoryLaunches(skip, limit);

  if (limit) {
    return res.status(200).json({
      launches: result.launches,
      total: result.total,
      page: Math.floor(skip / limit) + 1,
      limit: limit,
    });
  }

  return res.status(200).json(result);
};

const httpGetUpcomingLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const result = await getUpcomingLaunches(skip, limit);

  if (limit) {
    return res.status(200).json({
      launches: result.launches,
      total: result.total,
      page: Math.floor(skip / limit) + 1,
      limit: limit,
    });
  }

  return res.status(200).json(result);
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
};

module.exports = {
  httpGetAllLaunches,
  httpGetHistoryLaunches,
  httpGetUpcomingLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
