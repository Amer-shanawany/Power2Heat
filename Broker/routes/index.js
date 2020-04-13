const express = require('express');
const router = express.Router();
const {ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/',(req,res)=>res.render('welcome'));

// Dashboard 
router.get('/dashboard',ensureAuthenticated,    (req,res)=> 
    res.render('dashboard',{
        name: req.user.name
    }));
     // render the page and save the view 
// add ensureAuthenticated to protect the page 
//no access without login resource www.passportjs.org


module.exports = router;