/*
*  This is just a skeleton for the most part! It all still needs to be implemented!
*  Only the user stuff is working!
*  We'll probably all die alone!
*  Just kidding, only some of it is skeletal now!
*/


// dependencies
const express = require('express');
const connect = require('connect-ensure-login');
const nodemailer = require('nodemailer');

//set up mailer, based on info from the nodemailer docs
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'splitplease.notify@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

// models
const User = require('../models/user');
const Order = require('../models/order');
const Claim = require('../models/claim');

const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  if(req.isAuthenticated()){
    res.send(req.user);
  }
  else{
    res.send({
        name: 'Eva Lu Ator',
        orders: ['orphan kidneys', 'black market kinder eggs'],
        reliability: 'yes',
        fbid: 'two',
        location: 'right here right now'
    });
  }
});

router.get('/user', function(req, res) {
  User.findOne({_id : req.query._id}, function(err, user) {
    res.send(user);
  });
});


router.get('/orders', function(req, res) {
    if (req.query.creator_id !== undefined) {
        if (req.query.completed === 'false') {
            Order.find({creator_id : req.query.creator_id, completed : false}, function(err, orders) {
                res.send(orders);
            });
        } else {
            Order.find({creator_id : req.query.creator_id}, function(err, orders) {
                if (err){
                    res.send(err);
                }
                res.send(orders);
            });
        }
    } else if (req.query._id !== undefined) {
        Order.findOne({_id : req.query._id}, function(err, order){
            if(err) {
                res.send(err);
            }
            res.send(order);
        });
    } else {
        Order.find({completed: false}, function(err, orders){
            res.send(orders);
        });
    }   
});

router.post('/orders',
    connect.ensureLoggedIn(),
    function(req, res) {
        User.findOne({ _id: req.user._id },function(err,user) {
            const newOrder = new Order({
                'item' : req.body.item,
                'link' : req.body.link,
                'quantity' : req.body.quantity,
                'units' : req.body.units,
                'location' : user.location,
                'numberRemaining': req.body.numberRemaining,
                'creator_name' : user.name,
                'creator_id' : user._id,
                'remaining' : req.body.remaining,
                'completed' : req.body.completed,
                'expDate'   : req.body.expDate,
                'startDate' : req.body.startDate,
             });
            newOrder.save(function(err, order) {
                if (err) console.log(err);
            });
        res.send({});
    });
});


//Post a new location for a User
router.post('/location',
    connect.ensureLoggedIn(),
    function(req, res) {
        User.findOneAndUpdate({_id: req.user._id}, {location: req.body.location}, {upsert: true}, function(err, user) {
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
    });
});

router.get('/claim', function(req, res) {
    Claim.find({parent : req.query.parent},function(err, claims){
        res.send(claims);
    });
});

router.post('/claim', 
    connect.ensureLoggedIn(),
    function(req, res) {
        User.findOne({ _id: req.user._id },function(err,user) {
            if (err) console.log(err);
            const newClaim = new Claim({
                'user_name' : user.name,
                'user_id' : user._id,
                'parent' : req.body.parent,
                'quantity' : req.body.quantity,
                'legal'    : true,
            });
            newClaim.save(function(err, claim) {
                if (err) console.log(err);
            });
        

        res.send({});
    });
});

router.post('/sendordermail', 
    connect.ensureLoggedIn(), 
    function (req, res) {
        var mailOptions = {
            from: 'splitplease.notify@gmail.com',
            to: req.body.recip,
            subject: req.body.sub,
            text: 'This order has been placed. Please coordinate pickup and payment.'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        Order.findOneAndUpdate({_id : req.body.order}, {completed : true}, {upsert : true}, function(err, order) {
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
        });
    });

router.post('/deleteordermail', 
    connect.ensureLoggedIn(), 
    function (req, res) {
        var mailOptions = {
            from: 'splitplease.notify@gmail.com',
            to: req.body.recip,
            subject: req.body.sub,
            text: 'This order has been cancelled :('
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        Order.remove({_id : req.body.order}, function(err, results) {
            if (err) return res.send(500, { error: err });
        });
    });



router.post('/remainder',
    connect.ensureLoggedIn(),
    function(req, res) {
        Order.findOne({_id : req.body.parent}, function(err, order){
            if ((order.remaining-req.body.remaining)<0) { 
                Claim.findOneAndUpdate({parent : req.body.parent, quantity : req.body.remaining}, {$set:{'legal': false}}, {sort : {$natural: -1}}, function(err, claims) {
                    console.log(claims.legal);
                    if (err) { res.send(500, {error:err}); }

                });
                res.json('u wrong');

            }
            else{
                Order.findOneAndUpdate({_id : req.body.parent}, { $inc: {'remaining' : -req.body.remaining}}, {upsert : true}, function(err, ord) {
                    console.log(err);
                    if (err) res.send(500, { error: err });
                    res.send("succesfully saved");
                });
            }

        })
    });


module.exports = router;