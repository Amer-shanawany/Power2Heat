const express = require("express");
const router = express.Router();
const Settings = require('../models/Settings')
const publish = require("../pub");
router.get("/:id", (req, res) => {
    let wattage, volume, mintemp, maxtemp, desiredtemp;
    Settings.findOne({ boilerID: req.params.id }).then(resSettings => {
        // if (err) console.log(err)

        if (!resSettings) {
            wattage = 0;
            volume = 0;
            mintemp = 0;
            maxtemp = 0;
            desiredtemp = 0;
            res.render("settings", {
                id: req.params.id,
                wattage: wattage,
                mintemp: mintemp,
                maxtemp: maxtemp,
                volume: volume,
                desiredtemp: desiredtemp
            })
        } else {
            res.render("settings", {
                id: req.params.id,
                wattage: resSettings.wattage,
                mintemp: resSettings.mintemp,
                maxtemp: resSettings.maxtemp,
                volume: resSettings.volume,
                desiredtemp: resSettings.desiredtemp
            })
        }


    }, notfulfiled => {

    })


})
//TODO post handle for the setting form and publish to MQTT 
router.post("/:id", (req, res) => {
    const { volume, wattage, desired, mintemp, maxtemp } = req.body
    const newSettings = ({

        wattage: wattage,
        mintemp: mintemp,
        maxtemp: maxtemp,
        desiredtemp: desired,
        volume: volume
    })
    Settings.findOneAndUpdate({ boilerID: req.params.id }, newSettings, { upsert: true }, (err, update) => {
        if (err) console.log(err)

    })
    publish(`P2H/${req.params.id}/settings`, JSON.stringify(newSettings))
    res.render("settings", {
        id: req.params.id,
        wattage: wattage,
        mintemp: mintemp,
        maxtemp: maxtemp,
        desiredtemp: desired,
        volume: volume
    })

})
module.exports = router;