const db = require("../config/connection");
const collection = require("../config/collections");
const userHelpers = require("./userHelpers");
const { response } = require("express");
var objectId = require("mongodb").ObjectId;
module.exports = {
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      let users = db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray();
      resolve(users);
    });
  },

  blockUser: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: objectId(proId) },
          {
            $set: {
              access: false,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  unblockUser: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: objectId(proId) },
          {
            $set: {
              access: true,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let allOrders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find()
        .toArray();
      allOrders = allOrders.reverse();
      // console.log(allOrders);
      resolve(allOrders);
    });
  },

  setStatus: (status, orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              status: status,
            },
          }
        )
        .then(async (response) => {
          if (status == "Cancelled") {
            const products = await userHelpers.getOrderProducts(orderId);
            let i = 0;
            for (i = 0; i < products.length; i++) {
              db.get()
                .collection(collection.PRODUCT_COLLECTION)
                .updateOne(
                  {
                    _id: objectId(products[i].item),
                  },
                  {
                    $inc: { Stock: products[i].quantity },
                  }
                )
                .then((response) => {
                  console.log(`Stock increased for ${i} items`);
                });
            }
          }
          console.log(response);
          resolve({ statusUpdated: true });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  cancelRequests: () => {
    return new Promise(async (resolve, reject) => {
      const requests = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({ status: "Cancel requested" })
        .toArray();
      // console.log(requests);
      resolve(requests);
    });
  },
};
