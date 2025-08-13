const { planets } = require("../../models/planets.model");

const httpGetAllPlanets = (req, res) => {
  return res.status(200).json(planets);
};

module.exports = {
  httpGetAllPlanets,
};
