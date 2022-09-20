const express = require("express");
const app = express.Router();
const controller = require("../controller/controller");
const passport = require("passport");
const multer = require("multer");

app.get("/register", controller.register);

app.post("/register", controller.registeration);

app.get("/login", controller.login);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/my-account",
    failureRedirect: "/login", // see text
    failureFlash: true, // optional, see text as well
  }),
  controller.signIn
);

app.use((req, res, next) => {
  if (!req.session.passport) {
    res.redirect("/login");
  } else {
    if (!req.session.passport.user) {
      res.redirect("/login");
    } else {
      res.locals.user = req.session.passport.user;
      next();
    }
  }
});

app.get("/", controller.home);

app.get("/my-account", controller.account);

app.post("/my-account", controller.myAccount);

app.get("/addProduct", controller.addProduct);

app.post("/addProduct", controller.addProducts);

app.get("/logout", controller.logout);

module.exports = app;
