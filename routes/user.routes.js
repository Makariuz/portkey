const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isLoggedOut } = require("../middlewares/guard");
const multer = require("multer");
const upload = require("../config/cloudstorage");

router.get("/");

router.get("/create", (req, res) => {
  res.render("user/sign-up", {
    message: "Sign up to add and read all content",
  });

});

router.post("/create", upload.single("picture"), async (req, res) => {

   
  if (!req.file) {
    const user = new User({ ...req.body });

    const exists = await User.findOne({
      email: req.body.email,
      username: req.body.username,
    });
    if (exists) {
      res.send("username or email already exists");
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    try {
      await user.save();
      res.render("user/login", { message: "Signed up, you can log in now!" });
    } catch (err) {
      console.error(err);
      res.redirect("error");
    }
  } else {
    const user = new User({ ...req.body, picture: req.file.path });
    const exists = await User.findOne({
      email: req.body.email,
      username: req.body.username,
    });
    if (exists) {
      res.render("error", { message: "username or email already exists" });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    try {
      await user.save();
      res.render("user/login", { message: "Signed up, you can log in now!" });
    } catch (err) {
      console.error(err);
      res.redirect("error");
    }
  }


});

router.get("/login", (req, res) => {
  res.render("user/login", { message: "" });
});

router.post("/login", async (req, res) => {
    console.log(req.body)
  const user = await User.findOne({ email: req.body.email });
  
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.currentUser = user;
      console.log(user)
      res.redirect("/auth/profile");
    } else {
      res.render("user/login", { message: "The password is incorrect" });
    }
  } else {
    res.render("user/login", { message: "No user found" });
  }
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
