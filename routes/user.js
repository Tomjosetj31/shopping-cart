var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
const userHelper = require('../helpers/user-helpers')
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  }else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user;
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { products, user});
  })
});

router.get('/signup', function(req, res, next) {
  res.render('user/signup');
})

router.post('/signup', function(req, res, next) {
    userHelper.doSignup(req.body).then((response) => {
        res.redirect('/login')
    })
});

router.get('/login', function(req, res, next) {
  if(req.session.loggedIn) {
    res.redirect('/');
  }else{
    res.render('user/login', {"loginErr":req.session.loginErr});
    req.session.loginErr = false;
  }
})

router.post('/login', function(req, res, next) {
    userHelper.doLogin(req.body).then((response)=>{
      if(response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect('/')
      }else {
        req.session.loginErr = "Invalid username or password";
        res.redirect('/login')
      }
    })
})
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/login');
})

router.get('/cart', verifyLogin, function(req, res, next){
    res.render('user/cart');
});

router.get('/add-to-cart/:id', verifyLogin, (req, res, next) => {
  userHelper.addToCart(req.params.id, req.session.user._id).then((response)=>{
      res.redirect('/');
  })
})

module.exports = router;
