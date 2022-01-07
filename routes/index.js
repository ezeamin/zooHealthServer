const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/signup", (req, res) => {
  console.log(req.body);
  passport.authenticate("local-signup", (err, user, info) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    return res.status(200).json(user);
  })(req, res);
});

router.post("/login", (req, res) => {
  passport.authenticate("local-login", {
    successRedirect: "/success",
    failureRedirect: "/error",
  })(req, res);
});

router.get("/error", (req, res) => {
  res.status(401).json({ message: "Unauthorized", code: 1 });
});

router.get("/success", (req, res) => {
  res.status(200).json({ message: "Success", code: 0 });
});

router.delete("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: "Success", code: 0 });
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized", code: 1 });
};

router.get("/auth", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user, code: 0 });
});

module.exports = router;
