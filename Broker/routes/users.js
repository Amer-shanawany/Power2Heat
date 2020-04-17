const express = require('express');
const router = express.Router();
const passport = require('passport')

//User model
const User = require('../modules/User');
//Boiler model 
const Boiler = require('../modules/Boiler')
//Encrypting Users data 
const bcrypt = require('bcryptjs')

//Login Page
router.get('/login',(req,res)=>res.render('login'))

//Register Page
router.get('/register',(req,res)=>res.render('register'))
//Register Handle 
router.post('/register',(req,res)=>{
    console.log(req.body);
    const {name, email, password, password2} = req.body;
    let errors =[];

    //Check required fields 
    if(!name|| !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
    }
    //Check Password match 
      if(password!==password2){
        errors.push({msg:'Password do not match'})
    }
    //Check password length
      if(password.length <6 )
    {
        errors.push({msg:'Password should be at least 6 characters'})
    }
      if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation passed
        User.findOne({ email:  email })
        .then(user => {
            if(user){
                //User exists
                 errors.push({msg: 'email is already registered'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //Hash password
                bcrypt.genSalt(10, (err,salt)=> 
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        //set password to hash
                        newUser.password= hash;
                         //save the user 
                         newUser.save()
                            .then(user =>{
                                req.flash('success_msg','You are now registered and can log in');
                                res.redirect('/users/login');
                            } )
                            .catch(err => console.log(err))
                    
                })); 
            }
        });
        
    }
})

// Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect:'/main',
        failureRedirect:'/users/login',
        failureFlash:true 
    })(req, res, next);
     
})

//Add a new Node page Handle 
router.get('/addnode',(req,res)=>res.render('addnode'));

//Add a new Node Id handle
router.post('/addnode',(req,res)=>{
     const userID = req.user._id;
        // TODO: Check RegEx [A-Z]{8} 
    const {nodeID} = req.body;
    let errors=[];
    const regex = /([A-Z]{8})/g;

    // Example: AXDCFEQA
    if(nodeID==''){
        errors.push({msg: `The field was empty`})
    }
    if(!regex.test(nodeID)){
        console.log(regex.test(nodeID))
        errors.push({msg: `The ID you've entered doesn't match our database`})
       // req.flash('error_msg_regex',`The ID you've entered doesn't match our database ${regex}`)
      //  res.render('/addnode')
        
    }
    
    
    if(errors.length>0){
        res.render('addnode',{errors})
    }else{
    User.findOne({_id: userID}).then(user=>{
        let userNodes = user.nodes;
      
         if(user.nodes.includes(nodeID)){
             //boiler exists ///TODO : make the check on the user side NOT on the boiler document 
            errors.push({msg: 'boiler is already registered'})
            //req.flash('error_msg_node',`boiler ${nodeID} is already registered`)
           // res.render('/addnode')
            res.render('addnode',{errors})
        }else{

            User.findOneAndUpdate({ _id: userID} , {$push: { nodes:  req.body.nodeID }},
                { upsert: true } , function(err,updatedUser){
                    if(err)
                        console.log(err);
                    //Make a new Boiler document 
                    Boiler.findOne({ nodeID:  nodeID })
                    .then(boiler => {
                       
                            const newBoiler = new Boiler({
                                nodeID,
                                userID
                            })
                            newBoiler.save()
                    })
                                         
                    req.flash('success_msg_add_node',`You've successfully added ${req.body.nodeID} to your nodes`)
                    res.redirect('/main')
                 });


        }


     })}

 
})

//Dashboard handle

router.get('/dashboard/:x',(req,res)=>{
    var x = req.params.x
    res.render('dashboard',{
    name: req.user.name,
    email: req.user.email,
    nodes: req.user.nodes,
    x: x


    })
    console.log()
})

// Logout Handle 
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login')
})



module.exports = router;