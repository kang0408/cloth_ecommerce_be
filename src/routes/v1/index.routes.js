const { prefixVersion } = require("../../configs/system");

const clothesRoutes = require("./clothes.routes");
const categoriesRoutes = require("./categories.routes");
const authRoutes = require("./auth.routes");

module.exports = (app) => {
  app.use(prefixVersion + "/clothes", clothesRoutes);
  app.use(prefixVersion + "/categories", categoriesRoutes);
  app.use(prefixVersion + "/auth", authRoutes);
};
