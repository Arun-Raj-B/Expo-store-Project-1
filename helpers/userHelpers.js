const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("express");
var objectId = require("mongodb").ObjectId;
module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      const checkMail = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      const checkMobile = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ mobilenumber: userData.mobilenumber });
      if (!checkMail && !checkMobile) {
        userData.password = await bcrypt.hash(userData.password, 10);
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne({
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            mobilenumber: userData.mobilenumber,
            role: "user",
            access: true,
            isVerified: false,
          })
          .then((data) => {
            console.log(data);
            resolve(data.insertedId);
          });
      } else {
        if (checkMail) {
          let mailExistsErr = "Email already exists";
          reject(mailExistsErr);
        } else {
          let mobileExistsErr = "This mobile number is already in use";
          reject(mobileExistsErr);
        }
      }
    });
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("Login Succeess");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login failed");
        resolve({ status: false });
      }
    });
  },

  doVerify: (mobile) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { mobilenumber: mobile },
          {
            $set: {
              isVerified: true,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  checkNoExist: (mobile) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .findOne({
          mobilenumber: mobile,
        })
        .then((user) => {
          resolve(user);
        });
    });
  },

  addToCart: (proId, userId) => {
    console.log(proId, userId);
    return new Promise(async (resolve, reject) => {
      const userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userCart) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              user: objectId(userId),
            },
            {
              $addToSet: { products: objectId(proId) },
            }
          )
          .then((response) => {
            console.log("item added to cart");
            resolve();
          });
      } else {
        let cartObj = {
          user: objectId(userId),
          products: [objectId(proId)],
        };
        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve();
          });
      }
    });
  },

  addToWishlist: (proId, userId) => {
    console.log(proId, userId);
    return new Promise(async (resolve, reject) => {
      const userWishlist = await db
        .get()
        .collection(collection.WISHLIST_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userWishlist) {
        db.get()
          .collection(collection.WISHLIST_COLLECTION)
          .updateOne(
            {
              user: objectId(userId),
            },
            {
              $addToSet: { products: objectId(proId) },
            }
          )
          .then((response) => {
            resolve();
          });
      } else {
        let wishlistObj = {
          user: objectId(userId),
          products: [objectId(proId)],
        };
        db.get()
          .collection(collection.WISHLIST_COLLECTION)
          .insertOne(wishlistObj)
          .then((response) => {
            resolve();
          });
      }
    });
  },

  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItem = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              // $products - inside cart
              let: { prodList: "$products" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      //$_id - product id inside product collection
                      $in: ["$_id", "$$prodList"],
                    },
                  },
                },
              ],
              as: "cartItems",
            },
          },
        ])
        .toArray();
      resolve(cartItem[0].cartItems);
    });
  },

  getWishlistProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishlistItem = await db
        .get()
        .collection(collection.WISHLIST_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              // $products - inside wishlist
              let: { prodList: "$products" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      //$_id - product id inside product collection
                      $in: ["$_id", "$$prodList"],
                    },
                  },
                },
              ],
              as: "wishlistItems",
            },
          },
        ])
        .toArray();
      resolve(wishlistItem[0].wishlistItems);
    });
  },

  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartCount = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (cart) {
        cartCount = cart.products.length;
      }
      resolve(cartCount);
    });
  },

  getWishlistCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishlistCount = 0;
      let wishlist = await db
        .get()
        .collection(collection.WISHLIST_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (wishlist) {
        wishlistCount = wishlist.products.length;
      }
      resolve(wishlistCount);
    });
  },
};
