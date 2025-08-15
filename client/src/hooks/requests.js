const API_URL = process.env.REACT_APP_API_URL;

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Load paginated launches
async function httpGetPaginatedLaunches(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/launches?page=${page}&limit=${limit}`
  );
  const result = await response.json();

  // Sort the launches by flight number
  if (result.launches) {
    result.launches.sort((a, b) => a.flightNumber - b.flightNumber);
  }

  return result;
}

// Load paginated history launches (non-upcoming only)
async function httpGetPaginatedHistory(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/launches/history?page=${page}&limit=${limit}`
  );
  const result = await response.json();

  // Sort the launches by flight number
  if (result.launches) {
    result.launches.sort((a, b) => a.flightNumber - b.flightNumber);
  }

  return result;
}

// Load paginated upcoming launches (upcoming only)
async function httpGetPaginatedUpcoming(page = 1, limit = 10) {
  const response = await fetch(
    `${API_URL}/launches/upcoming?page=${page}&limit=${limit}`
  );
  const result = await response.json();

  // Sort the launches by flight number
  if (result.launches) {
    result.launches.sort((a, b) => a.flightNumber - b.flightNumber);
  }

  return result;
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpGetPaginatedLaunches,
  httpGetPaginatedHistory,
  httpGetPaginatedUpcoming,
  httpSubmitLaunch,
  httpAbortLaunch,
};
