const express = require("express");
const router = express.Router();


// Logout Handle
router.get("/", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;
