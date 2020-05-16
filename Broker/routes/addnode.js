
const express = require("express");
const router = express.Router();

//User model
const User = require("../models/User");
//Boiler model
const Boiler = require("../models/Boiler");

//Add a new Boiler page Handle
router.get("/", (req, res) => res.render("addnode"));

//Add a new Boiler Id handle
router.post("/", (req, res) => {
    const userID = req.user._id;
    // TODO: Check RegEx [A-Z]{8}
    const { boilerID } = req.body;
    let errors = [];
    const regex = /([A-Z]{8})/g;

    // Example: AXDCFEQA
    if (boilerID == "") {
        errors.push({ msg: `The field was empty` });
    }
    if (!regex.test(boilerID)) {
        //console.log(regex.test(boilerID));
        errors.push({ msg: `The ID you've entered doesn't match our database` });
        // req.flash('error_msg_regex',`The ID you've entered doesn't match our database ${regex}`)
        //  res.render('/addnode')
    }

    if (errors.length > 0) {
        res.render("addnode", { errors });
    } else {
        User.findOne({ _id: userID }).then((user) => {
            let userNodes = user.nodes;

            if (user.nodes.includes(boilerID)) {
                //boiler exists ///TODO : make the check on the user side NOT on the boiler document
                errors.push({ msg: "boiler is already registered" });
                //req.flash('error_msg_node',`boiler ${boilerID} is already registered`)
                // res.render('/addnode')
                res.render("addnode", { errors });
            } else {
                User.findOneAndUpdate(
                    { _id: userID },
                    { $push: { nodes: req.body.boilerID } },
                    { upsert: true },
                    function (err, updatedUser) {
                        if (err) console.log(err);
                        //Make a new Boiler document
                        Boiler.findOne({ boilerID: boilerID }).then((boiler) => {
                            const newBoiler = new Boiler({
                                boilerID,
                                userID,
                            });
                            newBoiler.save();
                        });

                        req.flash(
                            "success_msg_add_node",
                            `You've successfully added ${req.body.boilerID} to your nodes`
                        );
                        res.redirect("/main");
                    }
                );
            }
        });
    }
});

module.exports = router;
