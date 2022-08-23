const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products', {admin:true, products});
  })
});
router.get('/add-product', function(req, res, next) {
  res.render('admin/add-product');
});
router.post('/add-product', (req, res)=>{
  productHelper.addProduct(req.body, (id)=>{
    let image = req.files.Image;
            image.mv('./public/product-images/'+id+'.jpg', (err, done)=>{
                if(!err) {
                  res.render('admin/add-product');
                }else {
                  console.log(err)
                }
            })
  })

})

router.get('/delete-product/:id', (req, res)=>{
    let productId = req.params.id;
    productHelper.deleteProduct(productId).then((response)=>{
      res.redirect('/admin')
    })
});

router.get('/edit-product/:id', async(req, res)=>{
    let product = await productHelper.getProductDetails(req.params.id)
    res.render('admin/edit-product', {product})
});
router.post('/edit-product/:id', (req, res)=>{
  let productId = req.params.id;
  productHelper.editProduct(productId, req.body).then((response)=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/'+productId+'.jpg')
    }
  })
})

module.exports = router;
