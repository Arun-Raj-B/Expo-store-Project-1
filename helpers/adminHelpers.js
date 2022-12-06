const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require("bcrypt");
const { obj } = require("./otpHelper");
var objectId = require("mongodb").ObjectId;

module.exports = {
  adminSignup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      adminData.password = await bcrypt.hash(adminData.password, 10);
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne({
          username: adminData.username,
          password: adminData.password,
        })
        .then((data) => {
          console.log(data);
          resolve(data.insertedId);
        });
    });
  },

  adminLogin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ username: adminData.username });
      if (admin) {
        bcrypt.compare(adminData.password, admin.password).then((status) => {
          if (status) {
            console.log("login success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login failed");
        resolve({ status: false });
      }
    });
  },

  totalRevenue: () => {
    return new Promise(async (resolve, reject) => {
      const totalRevenue = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { status: { $ne: "Cancelled" } },
          },
          {
            $group: { _id: "", totalAmount: { $sum: "$totalAmount" } },
          },
          {
            $project: {
              _id: 0,
              TotalAmount: "$totalAmount",
            },
          },
        ])
        .toArray();
      console.log(totalRevenue[0].TotalAmount);
      resolve(totalRevenue[0].TotalAmount);
    });
  },

  topSellers: () => {
    return new Promise(async (resolve, reject) => {
      const topSellers = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .aggregate([
          { $project: { _id: 0, Name: 1, sales: 1 } },
          { $sort: { sales: -1 } },
          { $limit: 5 },
        ])
        .toArray();
      console.log(topSellers);
      resolve(topSellers);
    });
  },

  ordersDate: () => {
    return new Promise(async (resolve, reject) => {
      const ordersPer = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          { $group: { _id: "$date", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 5 },
        ])
        .toArray();
      console.log(ordersPer);
      resolve(ordersPer);
    });
  },

  addCoupon: (coupon) => {
    return new Promise((resolve, reject) => {
      let newCoupon = {
        name: coupon.name,
        limit: coupon.limit,
        discount: coupon.discount,
        date: coupon.date,
        users: [],
      };
      console.log(newCoupon);
      db.get()
        .collection(collection.COUPON_COLLECTION)
        .insertOne(newCoupon)
        .then((response) => {
          console.log(response);
          console.log("Coupon Added to database");
          resolve(response);
        });
    });
  },

  deleteCoupon: (coupon) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.COUPON_COLLECTION)
        .deleteOne({ _id: objectId(coupon.couponId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  getAllCoupons: () => {
    return new Promise(async (resolve, reject) => {
      const coupons = await db
        .get()
        .collection(collection.COUPON_COLLECTION)
        .find()
        .toArray();
      resolve(coupons);
    });
  },

  getSingleCategory: (category) => {
    return new Promise(async (resolve, reject) => {
      const singleCategory = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ category: category });
      resolve(singleCategory);
    });
  },

  allReturnRequests: () => {
    return new Promise(async (resolve, reject) => {
      const returns = await db
        .get()
        .collection(collection.RETURN_COLLECTION)
        .find({ resolved: false })
        .toArray();
      resolve(returns);
    });
  },

  acceptReturn: (details) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          {
            _id: objectId(details.orderId),
          },
          {
            $set: {
              status: details.status,
            },
          }
        )
        .then((response) => {
          db.get()
            .collection(collection.RETURN_COLLECTION)
            .updateOne(
              { _id: objectId(details.returnId) },
              {
                $set: {
                  status: details.status,
                  resolved: true,
                },
              }
            )
            .then((updated) => {
              console.log("Return all done");
              console.log(updated);
              resolve({ returned: true });
            });
        });
    });
  },

  addBanner: (banner) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.BANNER_COLLECTION)
        .insertOne({ name: banner.name })
        .then((data) => {
          resolve(data.insertedId);
        });
    });
  },
};
