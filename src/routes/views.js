// dependencies
const express = require('express');
const router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'src/views' });
});

router.get('/u/profile', function(req, res) {
  res.sendFile('profile.html', { root: 'src/views' });
});

router.get('/orders', function(req, res, next){
	res.sendFile('OrderModal.html', {root: 'src/views'});
});

router.get('/about', function(req, res) {
  res.sendFile('about.html', { root: 'src/views' });
});

router.get('/login.jpg', function(req, res) {
  res.sendFile('login.jpg', { root: 'src/views/images' });
});

router.get('/location.jpg', function(req, res) {
  res.sendFile('location.jpg', { root: 'src/views/images' });
});

router.get('/neworder.jpg', function(req, res) {
  res.sendFile('neworder.jpg', { root: 'src/views/images' });
});

router.get('/newordermodal.jpg', function(req, res) {
  res.sendFile('newordermodal.jpg', { root: 'src/views/images' });
});

router.get('/claim.jpg', function(req, res) {
  res.sendFile('claim.jpg', { root: 'src/views/images' });
});

router.get('/claimnumber.jpg', function(req, res) {
  res.sendFile('claimnumber.jpg', { root: 'src/views/images' });
});

router.get('/prevorders.jpg', function(req, res) {
  res.sendFile('prevorders.jpg', { root: 'src/views/images' });
});

router.get('/manageorder.jpg', function(req, res) {
  res.sendFile('manageorder.jpg', { root: 'src/views/images' });
});

module.exports = router;