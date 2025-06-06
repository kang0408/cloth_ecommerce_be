import { Application } from "express";

import systemConfig from "../../configs/system";

import clothesRoutes from "./clothes.routes";
import categoriesRoutes from "./categories.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./users.routes";
import otpsRoutes from "./otps.routes";
import wishlistsRoutes from "./wishlists.routes";
import cartRoutes from "./cart.routes";

const router = (app: Application) => {
  app.use(systemConfig.prefixVersion + "/clothes", clothesRoutes);
  app.use(systemConfig.prefixVersion + "/categories", categoriesRoutes);
  app.use(systemConfig.prefixVersion + "/auth", authRoutes);
  app.use(systemConfig.prefixVersion + "/users", userRoutes);
  app.use(systemConfig.prefixVersion + "/otp", otpsRoutes);
  app.use(systemConfig.prefixVersion + "/wishlists", wishlistsRoutes);
  app.use(systemConfig.prefixVersion + "/cart", cartRoutes);
};

export default router;
