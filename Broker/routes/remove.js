const express = require("express");
const router = express.Router();
const Boiler = require("../models/Boiler");
const User = require("../models/User")
router.get("/:id", (req, res) => {
    console.log(req.params.id)
    console.log(req.user._id)
    Boiler.findOneAndDelete({ boilerID: req.params.id }).then(resBoiler => {
        resBoiler.remove()
        // console.log(resBoiler)
        // console.log(req.user.id)
        // console.log(req.user._id)

    }).then(() => {
        User.findOneAndUpdate({ _id: req.user._id }, { $pull: { nodes: req.params.id } }, { upsert: true },
            function (err, updatedUser, res) {
                if (err) console.log(err)
                // if (updatedUser) console.log(updatedUser)
                // if (res) console.log(res)

            })
    }).finally(() => {
        return res.redirect('/main')

    })

    //res.redirect(200, `/main`)
})

module.exports = router