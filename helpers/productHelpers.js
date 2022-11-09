const db = require("../config/connection");
const collection = require("../config/collections");
var objectId = require("mongodb").ObjectId;
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
      const products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  deleteProduct: (prodId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: objectId(prodId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  getOneProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: objectId(proId) })
        .then((product) => {
          console.log(product);
          resolve(product);
        });
    });
  },

  updateProduct: (proId, product) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: objectId(proId) },
          {
            $set: {
              Name: product.Name,
              Category: product.Category,
              Subcategory: product.Subcategory,
              Price: product.Price,
              Description: product.Description,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  addCategory: (cat) => {
    return new Promise((resolve, reject) => {
      const category = cat.category;
      const subcategory = cat.subcategory.split(",");
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .insertOne({
          category: category,
          subcategory: subcategory,
        })
        .then((result) => {
          resolve(result);
        });
    });
  },

  getAllCategories: () => {
    return new Promise(async (resolve, reject) => {
      const categories = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .find()
        .toArray();
      resolve(categories);
    });
  },

  deleteCategory: (catId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .deleteOne({ _id: objectId(catId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },
};
