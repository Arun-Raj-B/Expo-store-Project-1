const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("express");
const { ObjectId } = require("mongodb");
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
    let proObj = {
      item: ObjectId(proId),
      quantity: 1,
    };

    return new Promise(async (resolve, reject) => {
      const userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userCart) {
        let prodExist = userCart.products.findIndex(
          (product) => product.item == proId
        );
        if (prodExist != -1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: objectId(userId), "products.item": objectId(proId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              {
                user: objectId(userId),
              },
              {
                $push: { products: proObj },
              }
            )
            .then((response) => {
              console.log("item added to cart");
              resolve();
            });
        }
      } else {
        let cartObj = {
          user: objectId(userId),
          products: [proObj],
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
    let proObj = {
      item: ObjectId(proId),
      quantity: 1,
    };

    return new Promise(async (resolve, reject) => {
      const userWishlist = await db
        .get()
        .collection(collection.WISHLIST_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userWishlist) {
        let prodExist = userWishlist.products.findIndex(
          (product) => product.item == proId
        );
        if (prodExist != -1) {
          db.get()
            .collection(collection.WISHLIST_COLLECTION)
            .updateOne(
              { user: objectId(userId), "products.item": objectId(proId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.WISHLIST_COLLECTION)
            .updateOne(
              {
                user: objectId(userId),
              },
              {
                $push: { products: proObj },
              }
            )
            .then((response) => {
              console.log("item added to wishlist");
              resolve();
            });
        }
      } else {
        let wishlistObj = {
          user: objectId(userId),
          products: [proObj],
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
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          // {
          //   $lookup: {
          //     from: collection.PRODUCT_COLLECTION,
          //     // $products - inside cart
          //     let: { prodList: "$products" },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             //$_id - product id inside product collection
          //             $in: ["$_id", "$$prodList"],
          //           },
          //         },
          //       },
          //     ],
          //     as: "cartItems",
          //   },
          // },
        ])
        .toArray();
      resolve(cartItems);
    });
  },

  getWishlistProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishlistItems = await db
        .get()
        .collection(collection.WISHLIST_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          // {
          //   $lookup: {
          //     from: collection.PRODUCT_COLLECTION,
          //     // $products - inside wishlist
          //     let: { prodList: "$products" },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             //$_id - product id inside product collection
          //             $in: ["$_id", "$$prodList"],
          //           },
          //         },
          //       },
          //     ],
          //     as: "wishlistItems",
          //   },
          // },
        ])
        .toArray();
      resolve(wishlistItems);
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

  ChangeCartProductQuantity: (details) => {
    const count = parseInt(details.count);
    const quantity = parseInt(details.quantity);
    return new Promise((resolve, reject) => {
      if (count == -1 && quantity == 1) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              _id: objectId(details.cart),
            },
            {
              $pull: { products: { item: objectId(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              _id: objectId(details.cart),
              "products.item": objectId(details.product),
            },
            {
              $inc: { "products.$.quantity": count },
            }
          )
          .then((response) => {
            resolve(true);
          });
      }
    });
  },

  ChangeWishlistProductQuantity: (details) => {
    const count = parseInt(details.count);
    const quantity = parseInt(details.quantity);
    return new Promise((resolve, reject) => {
      if (count == -1 && quantity == 1) {
        db.get()
          .collection(collection.WISHLIST_COLLECTION)
          .updateOne(
            {
              _id: objectId(details.wishlist),
            },
            {
              $pull: { products: { item: objectId(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collection.WISHLIST_COLLECTION)
          .updateOne(
            {
              _id: objectId(details.wishlist),
              "products.item": objectId(details.product),
            },
            {
              $inc: { "products.$.quantity": count },
            }
          )
          .then((response) => {
            resolve(true);
          });
      }
    });
  },

  removeCartProduct: (cartId, prodId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          {
            _id: objectId(cartId),
          },
          {
            $pull: { products: { item: objectId(prodId) } },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  removeWishlistProduct: (wishlistId, prodId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.WISHLIST_COLLECTION)
        .updateOne(
          {
            _id: objectId(wishlistId),
          },
          {
            $pull: { products: { item: objectId(prodId) } },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  wishlistToCart: (userId, proId, wishId) => {
    let proObj = {
      item: ObjectId(proId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      const userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      // const cartId = userCart._id;
      if (userCart) {
        let prodExist = userCart.products.findIndex(
          (product) => product.item == proId
        );
        console.log(prodExist);
        console.log("Prouct exist check");
        if (prodExist != -1) {
          console.log("product already exists removed from wishlist");
          db.get()
            .collection(collection.WISHLIST_COLLECTION)
            .updateOne(
              {
                _id: objectId(wishId),
              },
              {
                $pull: { products: { item: objectId(proId) } },
              }
            );
          resolve(true);
          // resolve({ exists: true });
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              {
                user: objectId(userId),
              },
              {
                $push: { products: proObj },
              }
            );
          console.log("product added to cart removed from wishlist");
          db.get()
            .collection(collection.WISHLIST_COLLECTION)
            .updateOne(
              {
                _id: objectId(wishId),
              },
              {
                $pull: { products: { item: objectId(proId) } },
              }
            );
          resolve({ productAdded: true });
          // .then((response) => {
          //   console.log("item added from wishlist to cart");
          //   resolve({ productAdded: true });
          // });
        }
      }
    });
  },

  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.Price"] } },
            },
          },
        ])
        .toArray();
      // console.log(total[0].total);
      try {
        console.log(total[0].total);
        resolve(total[0].total);
      } catch (err) {
        resolve(0);
      }
    });
  },

  placeOrder: (order, products, total) => {
    return new Promise((resolve, reject) => {
      console.log(order, products, total);
      let status = order.paymentMethod === "COD" ? "Placed" : "Pending";
      let orderObj = {
        deliveryDetails: {
          mobile: order.mobile,
          address: `${order.house}, ${order.street}, ${order.district}, ${order.state}`,
          pincode: order.pincode,
        },
        userId: objectId(order.userId),
        paymentMethod: order.paymentMethod,
        products: products,
        totalAmount: total,
        status: status,
        date: new Date().toLocaleDateString(),
      };
      console.log(orderObj);

      db.get()
        .collection(collection.ORDER_COLLECTION)
        .insertOne(orderObj)
        .then((response) => {
          db.get()
            .collection(collection.CART_COLLECTION)
            .deleteOne({ user: objectId(order.userId) });
          resolve();
        });
    });
  },

  getCartProductList: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      console.log(cart.products);
      resolve(cart.products);
    });
  },

  getUserOrders: (userId) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({ userId: objectId(userId) })
        .toArray();
      console.log(orders);
      resolve(orders);
    });
  },

  getSingleOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let order = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ _id: objectId(orderId) });
      // console.log(order);
      resolve(order);
    });
  },

  getOrderProducts: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let orderItems = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { _id: objectId(orderId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      console.log(orderItems);
      resolve(orderItems);
    });
  },

  cancelOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              status: "Cancel requested",
            },
          }
        );
    });
  },
};
