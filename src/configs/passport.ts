import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/users.model";

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || ""
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ google_id: profile.id });

        if (!user) {
          user = await User.create({
            google_id: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0].value
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);
