const productHelper = require("../helpers/productHelpers");

module.exports = {
  getHome: (req, res) => {
    // let products = [
    //   {
    //     name: "Jabla1",
    //     category: "Shirt",
    //     price: "200₹",
    //     description: "This is a good shirt",
    //     image: "users/images/menShirt1.jpg",
    //   },
    //   {
    //     name: "Jabla2",
    //     category: "Shirt",
    //     price: "250₹",
    //     description: "This is a good shirt",
    //     image: "users/images/menShirt2.jpg",
    //   },
    //   {
    //     name: "Jabla3",
    //     category: "Shirt",
    //     price: "210₹",
    //     description: "This is a good shirt",
    //     image: "users/images/menShirt3.jpg",
    //   },
    //   {
    //     name: "Jabla4",
    //     category: "Shirt",
    //     price: "150₹",
    //     description: "This is a good shirt",
    //     image: "users/images/menShirt3.jpg",
    //   },
    //   {
    //     name: "Jabla4",
    //     category: "Shirt",
    //     price: "150₹",
    //     description: "This is a good shirt",
    //     image: "users/images/menShirt3.jpg",
    //   },
    // ];
    productHelper.getAllProducts().then((products) => {
      console.log(products);
      res.render("users/home", { products });
    });
  },

  getLogin: (req, res) => {
    res.render("users/login");
  },

  getSignup: (req, res) => {
    res.render("users/signup");
  },
};
