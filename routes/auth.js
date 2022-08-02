const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login",[
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value })
        .then((user) => {
          if (!user) {
            return Promise.reject('Invalid email or password')
          } 
        })
      }).normalizeEmail(),
    body(
      "password",
      "Password has to be valid"
    )
      .isLength({ min: 5 })
      .isAlphanumeric().trim(),
  ], authController.postLogin);


router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // if (value === "ini@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;
        return User.findOne({ email: value })
        .then((userDoc) => {
          if (userDoc) {
            // req.flash("error", "E-mail exists already, please pick another one.");
            // return res.redirect("/signup");
            return Promise.reject('E-mail exists already, please pick another one')
          }
        })
      }).normalizeEmail(),
    body(
      "password",
      "Please enter an alphanumeric password with at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric().trim(),
    body("confirmPassword").trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords have to match");
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
