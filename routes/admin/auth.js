const express = require("express");
const usersRepo = require("../../repositories/users");

const { handleError } = require("./middlewares");
//Templates
const signupTemp = require("../../views/admin/auth/signup");
const signinTemp = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePass,
  PassConf,
  signinValidEmail,
  signinValidPass,
} = require("./validators");

const router = express.Router();

// Get Signup
router.get("/signup", (req, res) => {
  res.send(signupTemp({ req }));
});

//post signup
router.post(
  "/signup",
  [requireEmail, requirePass, PassConf],
  handleError(signupTemp),
  async (req, res) => {
    const { email, password, passwordConf } = req.body;

    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);
// get signout
router.get("/signout", (req, res) => {
  req.session = null;
  res.send(`Your Logged out...`);
});
// get signin
router.get("/signin", (req, res) => {
  res.send(signinTemp({}));
});

router.post(
  "/signin",
  [signinValidEmail, signinValidPass],
  handleError(signinTemp),
  async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });
    if (!user) {
      return res.send("Email not found.");
    }

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);
module.exports = router;
