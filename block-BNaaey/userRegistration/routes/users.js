var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if(err) return next(err);
    res.render('users', { users });
  });
});
router.get('/dashboard', (req, res, next) => {
  console.log(req.session);
  User.findOne({_id: req.session.userId }, (err, user) => {
    if(err) return next(err);
    res.render('dashboard', { user });
  });
})

router.get('/register', function(req, res, next) {
    res.render('registration');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(user);
    res.redirect('/users/login');
  });
});
// Login
router.get('/login', (req,res, next) =>  {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    res.redirect('users/login');
  }
  User.findOne({ email }, (err, user) => {
  if(err) return next(err);
    if(!user) {
      return res.redirect('users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
      return res.redirect('users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users/dashboard');
    });
  });
});

// Logout
router.get('/logout', (req, res, next) => {
  res.redirect('/users/login');  
}); 

module.exports = router;

