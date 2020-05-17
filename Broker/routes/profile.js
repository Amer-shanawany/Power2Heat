
const express = require("express");
const router = express.Router();
const publish = require('../pub')
const Profile = require('../models/Profile');

// User's Profile Handle
router.get("/:id", (req, res) => {
    //Get NODE Profile q
    // Profile.findOne({ id: req.params.id }) 
    let profiles = [];
    Profile.findOne({ id: req.params.id }).then(profileResult => {

        if (profileResult) {

            profiles = profileResult.profiles.sort(sortByProperty("time"))
            publish(`P2H/${req.params.id}/profile`, JSON.stringify(profiles).toString())
            //console.log(profiles)
        }
        res.render("profile", {
            id: req.params.id,
            profiles: profiles
        })

    }, notfulfiled => {
        res.render("profile", {
            id: req.params.id,

        })
    })
})

//POST User's profile


//const Broker = require('../borker')
router.post("/:id", (req, res) => {
    let profiles;
    //const client = Broker(req.params.id)
    //console.log(req.body)
    let time = parseInt(req.body.day * 24 * 60) + parseInt(req.body.hour * 60) + parseInt(req.body.minute);
    Profile.findOneAndUpdate(
        { id: req.params.id },
        { $push: { profiles: { time: time, temp: req.body.temperature } } },
        { upsert: true },
        function (err, updatedProfile, res) {
            if (err) console.log(err);
            if (updatedProfile) {
                console.log(updatedProfile)

            }
        })

    return res.redirect(301, `/users/profile/${req.params.id}`)
})
//Sorting Array function 
function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}

router.post("/:id/:profileID", (req, res) => {

    Profile.findOneAndUpdate(
        { id: req.params.id },
        { $pull: { profiles: { time: req.params.profileID } } },
        { upsert: true },
        function (err, updatedProfile, res) {
            if (err) console.log(err);
            if (updatedProfile) {
                console.log(updatedProfile)

            }
        })
    return res.redirect(301, `/users/profile/${req.params.id}`)
})
module.exports = router;

