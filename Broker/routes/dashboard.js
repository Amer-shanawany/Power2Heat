const Boilerdata = require("../models/Boilerdata");
const express = require("express");
const router = express.Router();

//GET
router.get("/:x", (req, res) => {
    var boilerID = req.params.x;
    var timestamps = [];
    var charges = [];
    var temps = [];
    var volumes = [];
    var resTime = [];
    Boilerdata.find({ boilerID: boilerID }).exec(function (err, resdata) {
        if (err) console.log(err);
        //console.log(res);

        resdata.forEach((element) => {
            timestamps.push(element.data.timestamp);
            charges.push(parseInt(element.data.charge));
            volumes.push(parseInt(element.data.volume));
            temps.push(parseFloat(element.data.temp));
            //console.log(parseInt(element.data.charge));

            tempDate = new Date(parseInt(element.data.timestamp));
            tempMinutes = tempDate.getMinutes();
            tempSeconds = tempDate.getSeconds();
            tempHour = tempDate.getHours();
            resDate = tempHour + ":" + tempMinutes + ":" + tempSeconds;
            // resDate = resDate.toString();
            resTime.push(tempSeconds);
        });
        res.render("dashboard", {
            boilerID: req.params.x,
            resTime: resTime,
            charges: charges,
            temps: temps,
            volumes: volumes,
        });
    });
});


module.exports = router;