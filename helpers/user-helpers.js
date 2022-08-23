var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {

            const salt = await bcrypt.genSalt(10);
            userData.Password = await bcrypt.hash(userData.Password, salt)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId);
            })
        })
    },
    doLogin: (userData) =>{
        return new Promise(async(resolve, reject) => {  
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email: userData.Email})
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.user =user
                        response.status = true
                        resolve(response)
                    }else{
                        resolve({status: false})
                    }
                })
            }else{
                resolve({status: false})
            }
        })
    },
    addToCart: (productId, userId)=> {
        return new Promise(async(resolve, reject) => { 
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user: ObjectId(userId)})
            if (userCart) {
                db.get().collection(collection.CART_COLLECTION).updateOne({user: ObjectId(userId)}, {
                    $push: {products:ObjectId(productId)}
                }).then((response)=>{
                    resolve(response)
                })
            }else {
                let cartObj = {
                    user:ObjectId(userId),
                    products:[ObjectId(productId)],
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
         })
    }
}