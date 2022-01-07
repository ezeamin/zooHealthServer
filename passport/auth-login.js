const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

passport.use(
  "local-login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const user = await User.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "Incorrect username.", code: 1 });
      }
      if (!user.comparePassword(password, user.password)) {
        return done(null, false, { message: "Incorrect password.", code: 2 });
      }
      return done(null, user, { message: "Correct login.", code: 0 });
    }
  )
);

passport.use(
  "local-signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const exits = await User.exists({ username: username });

      if (exits) {
        return done(null, false, {
          message: "Username already taken.",
          code: 1,
        });
      } else {
        const existsEmail = await User.exists({ email: req.body.email });

        if (existsEmail) {
          return done(null, false, {
            message: "Email already taken.",
            code: 3,
          });
        } else {
          const user = new User({
            email: req.body.email,
            name: req.body.name,
            username: username,
          });
          user.password = user.encryptPassword(password);
          await user.save();
          return done(null, user);
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
