const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Must be between 5 and 40 characters."),
  RequirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a number greater than 1."),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email.")
    .custom(async (email) => {
      const existUser = await usersRepo.getOneBy({ email });
      if (existUser) {
        throw new Error("Email in use.");
      }
    }),
  requirePass: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters."),
  PassConf: check("passwordConf")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters.")
    .custom(async (passwordConf, { req }) => {
      if (passwordConf !== req.body.password) {
        throw new Error("Passwords must match.");
      }
    }),
  signinValidEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must provide a valid email")
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error("Email not found!");
      }
    }),
  signinValidPass: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error("Invalid Password!");
      }
      const ValidPass = await usersRepo.comparePass(user.password, password);
      if (!ValidPass) {
        throw new Error("Invalid password");
      }
    }),
};
