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
router.get('/', async function(req, res, next) {
  let user = req.session.user;
  let cartCount= null
  if(req.session.user){
    cartCount = await userHelper.getCartCount(req.session.user._id)
    
  }
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { products, user, cartCount});
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

router.get('/cart', verifyLogin, async (req, res, next)=>{
    let products = await userHelper.getCartProducts(req.session.user._id);
    res.render('user/cart', {products, user: req.session.user});
});

router.get('/add-to-cart/:id', (req, res, next) => {
  userHelper.addToCart(req.params.id, req.session.user._id).then((response)=>{
      res.json({success: true})
  })
})

module.exports = router;
