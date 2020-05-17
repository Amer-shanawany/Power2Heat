//Login Page
const express = require("express");
const router = express.Router();
const passport = require("passport");

//GET
router.get("/", (req, res) => res.render("login"));
// post
router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/main",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
});
module.exports = router;
