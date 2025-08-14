require("dotenv").config();

const express = require("express");
const passport = require("passport");
const router = express.Router();
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
       
        
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));



router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/signup" }),
  (req, res) => {
    res.redirect("/listings");
  }
);

module.exports = router;