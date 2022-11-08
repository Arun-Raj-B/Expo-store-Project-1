const db = require("../config/connection");
const collection = require("../config/collections");
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
};
