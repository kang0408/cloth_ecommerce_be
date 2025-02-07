const { prefixVersion } = require("../../configs/system");

const clothesRoutes = require("./clothes.routes");

module.exports = (app) => {
  app.use(prefixVersion + "/clothes", clothesRoutes);
};
