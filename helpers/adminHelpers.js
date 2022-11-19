const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require("bcrypt");

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
};
