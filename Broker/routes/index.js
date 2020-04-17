const express = require('express');
const router = express.Router();
const {ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/',(req,res)=>res.render('welcome'));

// MainPage 
router.get('/main',ensureAuthenticated,    (req,res)=> {
    res.render('main',{
        name: req.user.name,
        email: req.user.email,
        nodes: req.user.nodes 

    })
 });
     // render the page and save the view 
// add ensureAuthenticated to protect the page 
//no access without login resource www.passportjs.org


module.exports = router;