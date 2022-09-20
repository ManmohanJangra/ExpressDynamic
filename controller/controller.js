const express = require("express");
const { loginDetail } = require("../models/userSchema");
const { productCollection } = require("../models/productSchema");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const fileUpload = require("express-fileupload");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("avatarImg");

const home = (req, res) => {
  res.render("home");
};

const register = (req, res) => {
  res.render("register");
};

const registeration = (req, res) => {
  const ReguserName = req.body.reg_name;
  const userEmail = req.body.username;
  const password = req.body.password;

  loginDetail.register(
    {
      username: userEmail,
      userFname: ReguserName,
    },
    password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/");
          console.log("Login Successfull");
        });
      }
    }
  );
};

const login = (req, res) => {
  res.render("login");
};

const signIn = (req, res) => {
  const userLoginEmail = req.body.username;
  const userLoginPassword = req.body.password;

  const user = new loginDetail({
    username: userLoginEmail,
    password: userLoginPassword,
  });
};

const account = (req, res) => {
  const id = req.session.passport.user.id;
  loginDetail.findById(id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        res.render("my-account", {
          address: foundUser.address,
          phone: foundUser.phone,
          name: foundUser.userFname,
          image: foundUser.avatar,
        });
      }
    }
  });
};

const myAccount = async (req, res) => {
  upload(req, res, async function (err) {
    const userName = res.req.body.reg_name;
    const userEmail = res.req.body.username;
    const userNumber = res.req.body.phoneNumber;
    const userAddress = res.req.body.userAddress;

    if (req.file !== undefined) {
      const newImg = res.req.file.filename;

      const _id = req.session.passport.user.id;
      const updateUser = await loginDetail.findByIdAndUpdate(_id, {
        userFname: userName,
        phone: userNumber,
        address: userAddress,
        avatar: newImg,
      });
      updateUser.save((err) => {
        if (!err) {
          console.log("added Successfully");
        } else {
          console.log(err);
        }
      });
    } else {
      const _id = req.session.passport.user.id;
      const updateUser = await loginDetail.findByIdAndUpdate(_id, {
        userFname: userName,
        phone: userNumber,
        address: userAddress,
      });
      updateUser.save((err) => {
        if (!err) {
          console.log("added Successfully");
        } else {
          console.log(err);
        }
      });
    }
  });
  res.redirect("/my-account");
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
};

const addProduct = (req, res) => {
  res.render("addProduct");
};

const addProducts = (req, res) => {
  // res.render("addProduct");
};

module.exports = {
  home,
  register,
  registeration,
  login,
  signIn,
  account,
  myAccount,
  addProduct,
  addProducts,
  logout,
};
