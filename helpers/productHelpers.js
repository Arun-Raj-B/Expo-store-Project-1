const db = require("../config/connection");
const collection = require("../config/collections");
module.exports = {
  addProduct: (product, callback) => {
    console.log(product);
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne(product)
      .then((data) => {
        callback(data.insertedId);
      });
  },

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
};
