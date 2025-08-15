const axios = require("axios");

const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const saveLaunch = async (launch) => {
  await launchesDB.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
};

const findLaunch = async (filter) => await launchesDB.findOne(filter);

const populateLaunches = async () => {
  const response = await axios.post(process.env.SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc[`payloads`];
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc[`flight_number`],
      mission: launchDoc[`name`],
      rocket: launchDoc[`rocket`][`name`],
      launchDate: launchDoc[`date_local`],
      target: launchDoc[`destination`],
      customers,
      upcoming: launchDoc[`upcoming`],
      success: launchDoc[`success`],
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
};

const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
};

const existsLaunchWithId = async (launchId) =>
  await findLaunch({ flightNumber: launchId });

const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const getAllLaunches = async (skip, limit) => {
  const query = launchesDB.find({}, "-_id -__v").sort({ flightNumber: 1 });

  if (limit) {
    const launches = await query.skip(skip).limit(limit);
    const total = await launchesDB.countDocuments({});
    return { launches, total };
  }

  // If no limit specified, return all launches (for backward compatibility)
  return await query;
};

const getHistoryLaunches = async (skip, limit) => {
  const query = launchesDB
    .find({ upcoming: false }, "-_id -__v")
    .sort({ flightNumber: 1 });

  if (limit) {
    const launches = await query.skip(skip).limit(limit);
    const total = await launchesDB.countDocuments({ upcoming: false });
    return { launches, total };
  }

  return await query;
};

const getHistoryLaunchesCount = async () => {
  return await launchesDB.countDocuments({ upcoming: false });
};

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
};

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDB.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1;
};

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  getHistoryLaunches,
  getHistoryLaunchesCount,
  scheduleNewLaunch,
  abortLaunchById,
  loadLaunchData,
};
