var db = require('../config/connection')
var collection = require('../config/collections')
const { ObjectId } = require('mongodb')
module.exports = {
    addProduct: (product, callback) => {
        db.get().collection('products').insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },
    getAllProducts: () => {
        return new Promise(async(resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(productId)}).then((response) => {
                resolve(response);
            })    
        })
    },
    editProduct: (productId, productDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(productId)}, {$set:{
                Name: productDetails.Name,
                Description: productDetails.Description,
                Price: productDetails.Price,
                Category: productDetails.Category,

            }}).then((response) => {
                resolve(response);
            })    
        })
    },
    getProductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productId)}).then((response) => {
                resolve(response);
            });
        });
    }
}