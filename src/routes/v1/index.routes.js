const { prefixVersion } = require("../../configs/system");

const clothesRoutes = require("./clothes.routes");
const categoriesRoutes = require("./categories.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./users.routes");
const otpsRoutes = require("./otps.routes");
const wishlistsRoutes = require("./wishlists.routes");
const cartRoutes = require("./cart.routes");

module.exports = (app) => {
  app.use(prefixVersion + "/clothes", clothesRoutes);
  app.use(prefixVersion + "/categories", categoriesRoutes);
  app.use(prefixVersion + "/auth", authRoutes);
  app.use(prefixVersion + "/users", userRoutes);
  app.use(prefixVersion + "/otp", otpsRoutes);
  app.use(prefixVersion + "/wishlists", wishlistsRoutes);
  app.use(prefixVersion + "/cart", cartRoutes);
};
