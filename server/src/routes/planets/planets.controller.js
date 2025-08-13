const { planets } = require("../../models/planets.model");

const getAllPlanets = (req, res) => {
  return res.json(planets);
};

module.exports = {
  getAllPlanets,
};
