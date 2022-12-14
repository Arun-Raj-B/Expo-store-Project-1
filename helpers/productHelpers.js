const db = require("../config/connection");
const collection = require("../config/collections");
var objectId = require("mongodb").ObjectId;
module.exports = {
  addProduct: (product, callback) => {
    console.log(product);
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne({
        Name: product.Name,
        Category: product.Category,
        Subcategory: product.Subcategory,
        Stock: parseInt(product.Stock),
        Price: parseInt(product.Price),
        Description: product.Description,
        Deleted: false,
        sales: 0,
        Offer: parseInt(product.Offer),
        OfferPrice: Math.round(
          product.Price - (product.Price * product.Offer) / 100
        ),
      })
      .then((data) => {
        callback(data.insertedId);
      });
  },

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      const products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ Deleted: false, Stock: { $gte: 1 } })
        .toArray();
      resolve(products);
    });
  },

  deleteProduct: (prodId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: objectId(prodId) },
          {
            $set: {
              Deleted: true,
            },
          }
        )
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
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateProduct: (proId, product) => {
    return new Promise((resolve, reject) => {
      product.Quantity = Number(product.Quantity);
      product.Price = Number(product.Price);
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: objectId(proId) },
          {
            $set: {
              Name: product.Name,
              Category: product.Category,
              Subcategory: product.Subcategory,
              Stock: parseInt(product.Stock),
              Price: parseInt(product.Price),
              Description: product.Description,
              Offer: parseInt(product.Offer),
              OfferPrice: Math.round(
                product.Price - (product.Price * product.Offer) / 100
              ),
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  addCategory: (cat) => {
    return new Promise(async (resolve, reject) => {
      function capitalizeFirstLetter(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      }
      const category = capitalizeFirstLetter(cat.category);
      const subctgryArray = cat.subcategory.split(",");
      let subctgry = [];
      subctgryArray.forEach((sub) => {
        if (!subctgry.includes(sub)) {
          subctgry.push(sub);
        }
      });

      const exists = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ category: category });

      console.log(exists);

      if (!exists) {
        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .insertOne({
            category: category,
            subcategory: subctgry,
          })
          .then((result) => {
            resolve(result);
          });
      } else {
        let err = "This Category already exists";
        reject(err);
      }
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

  deleteSubcategory: (cat, sub) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .updateOne(
          {
            category: cat,
          },
          { $pull: { subcategory: sub } }
        )
        .then((response) => {
          console.log("category deleted successfully");
          resolve(response);
        });
    });
  },

  getOneCategory: (catId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ _id: objectId(catId) })
        .then((category) => {
          console.log(category);
          resolve(category);
        })
        .catch(() => {
          reject();
        });
    });
  },

  updateCategory: (catId, cat) => {
    return new Promise((resolve, reject) => {
      const subctgryArray = cat.subcategory.split(",");
      let subctgry = [];
      subctgryArray.forEach((sub) => {
        if (!subctgry.includes(sub)) {
          subctgry.push(sub);
        }
      });
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .updateOne(
          { _id: objectId(catId) },
          {
            $set: {
              category: cat.category,
              subcategory: subctgry,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  getCategoryProducts: (category) => {
    return new Promise(async (resolve, reject) => {
      let products = "";
      if (category == "all") {
        products = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .find({ Deleted: false, Stock: { $gte: 1 } })
          .toArray();
      } else {
        products = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .find({ Category: category, Deleted: false, Stock: { $gte: 1 } })
          .toArray();
      }
      resolve(products);
    });
  },
};
