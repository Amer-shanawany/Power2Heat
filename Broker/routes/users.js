//To Be Deleted 
//The plan was to implement two seperate routes 
// one for the users and the other for admins 

const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

var varname;
var email;
var nodes;

//User model
const User = require("../models/User");
//Boiler model
const Boiler = require("../models/Boiler");
//Encrypting Users data
const bcrypt = require("bcryptjs");

// //Login Page
//router.get("/login", (req, res) => res.render("login"));

//Register Page
// router.get("/register", (req, res) => res.render("register"));
// //Register Handle
// router.post("/register", (req, res) => {
//   const { name, email, password, password2 } = req.body;
//   let errors = [];

//   //Check required fields
//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: "Please fill in all fields" });
//   }
//   //Check Password match
//   if (password !== password2) {
//     errors.push({ msg: "Password do not match" });
//   }
//   //Check password length
//   if (password.length < 6) {
//     errors.push({ msg: "Password should be at least 6 characters" });
//   }
//   if (errors.length > 0) {
//     res.render("register", {
//       errors,
//       name,
//       email,
//       password,
//       password2,
//     });
//   } else {
//     //Validation passed
//     User.findOne({ email: email }).then((user) => {
//       if (user) {
//         //User exists
//         errors.push({ msg: "email is already registered" });
//         res.render("register", {
//           errors,
//           name,
//           email,
//           password,
//           password2,
//         });
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           password,
//         });
//         //Hash password
//         bcrypt.genSalt(10, (err, salt) =>
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             //set password to hash
//             newUser.password = hash;
//             //save the user
//             newUser
//               .save()
//               .then((user) => {
//                 req.flash(
//                   "success_msg",
//                   "You are now registered and can log in"
//                 );
//                 res.redirect("/users/login");
//               })
//               .catch((err) => console.log(err));
//           })
//         );
//       }
//     });
//   }
// });

// // Login Handle
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/main",
//     failureRedirect: "/users/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// //Add a new Node page Handle
// router.get("/addnode", (req, res) => res.render("addnode"));

// //Add a new Node Id handle
// router.post("/addnode", (req, res) => {
//   const userID = req.user._id;
//   // TODO: Check RegEx [A-Z]{8}
//   const { boilerID } = req.body;
//   let errors = [];
//   const regex = /([A-Z]{8})/g;

//   // Example: AXDCFEQA
//   if (boilerID == "") {
//     errors.push({ msg: `The field was empty` });
//   }
//   if (!regex.test(boilerID)) {
//     console.log(regex.test(boilerID));
//     errors.push({ msg: `The ID you've entered doesn't match our database` });
//     // req.flash('error_msg_regex',`The ID you've entered doesn't match our database ${regex}`)
//     //  res.render('/addnode')
//   }

//   if (errors.length > 0) {
//     res.render("addnode", { errors });
//   } else {
//     User.findOne({ _id: userID }).then((user) => {
//       let userNodes = user.nodes;

//       if (user.nodes.includes(boilerID)) {
//         //boiler exists ///TODO : make the check on the user side NOT on the boiler document
//         errors.push({ msg: "boiler is already registered" });
//         //req.flash('error_msg_node',`boiler ${boilerID} is already registered`)
//         // res.render('/addnode')
//         res.render("addnode", { errors });
//       } else {
//         User.findOneAndUpdate(
//           { _id: userID },
//           { $push: { nodes: req.body.boilerID } },
//           { upsert: true },
//           function (err, updatedUser) {
//             if (err) console.log(err);
//             //Make a new Boiler document
//             Boiler.findOne({ boilerID: boilerID }).then((boiler) => {
//               const newBoiler = new Boiler({
//                 boilerID,
//                 userID,
//               });
//               newBoiler.save();
//             });

//             req.flash(
//               "success_msg_add_node",
//               `You've successfully added ${req.body.boilerID} to your nodes`
//             );
//             res.redirect("/main");
//           }
//         );
//       }
//     });
//   }
// });


//Dashboard handle
//TODO: Limit number of data unit
const Boilerdata = require("../models/Boilerdata");
// router.get("/dashboard/:x", (req, res) => {
//   var boilerID = req.params.x;
//   var timestamps = [];
//   var charges = [];
//   var temps = [];
//   var volumes = [];
//   var resTime = [];
//   Boilerdata.find({ boilerID: boilerID }).exec(function (err, resdata) {
//     if (err) console.log(err);
//     //console.log(res);

//     resdata.forEach((element) => {
//       timestamps.push(element.data.timestamp);
//       charges.push(parseInt(element.data.charge));
//       volumes.push(parseInt(element.data.volume));
//       temps.push(parseFloat(element.data.temp));
//       //console.log(parseInt(element.data.charge));

//       tempDate = new Date(parseInt(element.data.timestamp));
//       tempMinutes = tempDate.getMinutes();
//       tempSeconds = tempDate.getSeconds();
//       tempHour = tempDate.getHours();
//       resDate = tempHour + ":" + tempMinutes + ":" + tempSeconds;
//       // resDate = resDate.toString();
//       resTime.push(tempSeconds);
//     });
//     res.render("dashboard", {
//       boilerID: req.params.x,
//       resTime: resTime,
//       charges: charges,
//       temps: temps,
//       volumes: volumes,
//     });
//   });
// });
/***
 *
 *
[3:48 PM] Overdulve Kristof
    138   window.appointmentSetType = function(appointmentId) {
139     window.appointmentType = parseInt(appointmentId);
140
141     var duration = 60;
142     var title = "";
143     switch (appointmentType) {
144       <%= for appointment_type <- @appointment_types do %>
145         case <%= appointment_type.id %>:
146           duration = <%= appointment_type.duration %>;
147           title = "<%= appointment_type.name %>";
148           break;
149       <% end %>
150       default:

 */
//res.sendFile(__dirname + "/test.html");

// function sortByProperty(property) {
//   return function (a, b) {
//     if (a[property] > b[property])
//       return 1;
//     else if (a[property] < b[property])
//       return -1;

//     return 0;
//   }
// }



// // User's Profile Handle
// router.get("/profile/:id", (req, res) => {
//   //Get NODE Profile q
//   // Profile.findOne({ id: req.params.id }) 
//   let profiles = [];
//   Profile.findOne({ id: req.params.id }).then(profileResult => {

//     if (profileResult) {

//       profiles = profileResult.profiles.sort(sortByProperty("time"))
//       publish(`P2H/${req.params.id}/profile`, JSON.stringify(profiles).toString())
//       //console.log(profiles)
//     }
//     res.render("profile", {
//       id: req.params.id,
//       profiles: profiles
//     })

//   }, notfulfiled => {
//     res.render("profile", {
//       id: req.params.id,

//     })
//   })
// })

// //POST User's profile

// const publish = require('../pub')
// const Profile = require('../models/Profile');
// //const Broker = require('../borker')
// router.post("/profile/:id", (req, res) => {
//   let profiles;
//   //const client = Broker(req.params.id)
//   //console.log(req.body)
//   let time = parseInt(req.body.day * 24 * 60) + parseInt(req.body.hour * 60) + parseInt(req.body.minute);
//   Profile.findOneAndUpdate(
//     { id: req.params.id },
//     { $push: { profiles: { time: time, temp: req.body.temperature } } },
//     { upsert: true },
//     function (err, updatedProfile, res) {
//       if (err) console.log(err);
//       if (updatedProfile) {
//         console.log(updatedProfile)

//       }
//     })

//   return res.redirect(301, `/users/profile/${req.params.id}`)

//   // .then(() => {

//   //   // Profile.find({ id: req.params.id }).then(profileResult => {

//   //   //   //console.log(JSON.stringify(profileResult))

//   //   //   var arr = new Uint8Array(profileResult)
//   //   //   arr = toBuffer(arr)

//   //   //   publish(`P2H/${req.params.id}/profile`, JSON.stringify(profileResult).toString())
//   //   //   res.redirect(301, `/users/profile/${req.params.id}`)

//   //   // })

//   // });



//   //res.end(JSON.stringify(req.body))
//   //JSON profiles Example
//   /***
//    * 
//    *  {"profiles":[{"time":1430,"temp":66},
//    *             {"time":1630,"temp":68},
//    *            {"time":3507,"temp":80}
//    *           ]}
//    * 
//    *  */
// })


// // Logout Handle
// router.get("/logout", (req, res) => {
//   req.logout();
//   req.flash("success_msg", "You are logged out");
//   res.redirect("/users/login");
// });

// module.exports = router;
