const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("express");
const { ObjectId, Timestamp } = require("mongodb");
const Razorpay = require("razorpay");
const { resolve } = require("path");
var objectId = require("mongodb").ObjectId;
var instance = new Razorpay({
  key_id: process.env.keyId,
  key_secret: process.env.keySecret,
});
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
            addresses: [],
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
        month: new Date().getMonth(),
        paymentId: "",
      };
      const orderedProducts = products.length;

      // console.log(products[0].item);
      // console.log(products[0].item);
      // console.log(products[0].item);

      if (order.paymentMethod == "COD") {
        let i = 0;
        for (i = 0; i < orderedProducts; i++) {
          db.get()
            .collection(collection.PRODUCT_COLLECTION)
            .updateOne(
              {
                _id: objectId(products[i].item),
              },
              {
                $inc: {
                  Stock: -products[i].quantity,
                  sales: products[i].quantity,
                },
              }
            )
            .then((response) => {
              console.log(`Stock reduced for ${i} items`);
            });
        }
      }

      // console.log(orderObj);

      db.get()
        .collection(collection.ORDER_COLLECTION)
        .insertOne(orderObj)
        .then((response) => {
          db.get()
            .collection(collection.CART_COLLECTION)
            .deleteOne({ user: objectId(order.userId) });
          resolve(response.insertedId);
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
      orders = orders.reverse();
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
        )
        .then((response) => {
          console.log(response);
          resolve({ request: true });
        });
    });
  },

  saveAddress: (address) => {
    return new Promise((resolve, reject) => {
      console.log("This is the user address");
      const useraddress = {
        house: address.house,
        street: address.street,
        district: address.district,
        state: address.state,
        pincode: address.pincode,
        mobile: address.mobile,
      };
      console.log(useraddress);

      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: objectId(address.userId) },
          { $push: { addresses: useraddress } }
        )
        .then((response) => {
          console.log("Address saved successfully");
          resolve({ saved: true });
        });
    });
  },

  generateRazorpay: (orderId, totalAmount) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalAmount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          connsole.log(err);
        } else {
          console.log(order);
          resolve(order);
        }
      });
    });
  },

  verifyPayment: (details) => {
    return new Promise(async (resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", process.env.keySecret);
      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        let order = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .findOne({ _id: objectId(details["order[receipt]"]) });

        let orderedProducts = order.products.length;

        let i = 0;
        for (i = 0; i < orderedProducts; i++) {
          db.get()
            .collection(collection.PRODUCT_COLLECTION)
            .updateOne(
              {
                _id: objectId(order.products[i].item),
              },
              {
                $inc: {
                  Stock: -order.products[i].quantity,
                  sales: order.products[i].quantity,
                },
              }
            )
            .then((response) => {
              console.log(`Stock reduced for ${i} items`);
            });
        }

        console.log("This is the order thats set for the payment");

        console.log("Resolved here");
        resolve();
      } else {
        console.log("Rejected here");
        reject();
      }
    });
  },

  setPaymentId: (paymentId, orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              paymentId: paymentId,
            },
          }
        )
        .then(() => {
          console.log("Payment Id added to database");
          resolve();
        })
        .catch(() => {
          console.log("Payment Id not added to database");
          reject();
        });
    });
  },

  findUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: objectId(userId) })
        .then((user) => {
          resolve(user);
        });
    });
  },

  deleteAddress: (address) => {
    return new Promise((resolve, reject) => {
      console.log("userId is " + address.userId);
      console.log("house is" + address.house);
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          {
            _id: objectId(address.userId),
          },
          {
            $pull: { addresses: { house: address.house } },
          }
        )
        .then((response) => {
          console.log("This is going to be resolved");
          console.log(response);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  editEmail: (details) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          {
            _id: objectId(details.userId),
          },
          {
            $set: { email: details.email },
          }
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },

  editMobile: (details) => {
    const mobile = parseInt(details.mobile);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          {
            _id: objectId(details.userId),
          },
          {
            $set: { mobilenumber: mobile },
          }
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },

  checkCoupon: (coupon, userId) => {
    return new Promise(async (resolve, reject) => {
      const userExist = await db
        .get()
        .collection(collection.COUPON_COLLECTION)
        .findOne({
          $and: [{ discount: coupon }, { users: { $in: [objectId(userId)] } }],
        });
      if (userExist) {
        console.log(userExist);
        console.log("user exists");
        reject();
      } else {
        console.log("user does not exist");
        console.log(coupon);
        userId = objectId(userId);
        db.get()
          .collection(collection.COUPON_COLLECTION)
          .updateOne(
            {
              discount: coupon,
            },
            {
              $push: { users: userId },
            }
          )
          .then((response) => {
            console.log(response);
            resolve();
          });
      }
    });
  },
};
