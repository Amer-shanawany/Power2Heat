
const express = require("express");
const router = express.Router();
const publish = require('../pub')
const Profile = require('../models/Profile');

router.post("/:id/:profileID", (req, res) => {
    console.log("clicked")

    return res.redirect(301, `/users/profile/${req.params.id}`)
})