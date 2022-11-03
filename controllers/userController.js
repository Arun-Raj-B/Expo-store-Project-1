const productHelper = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");

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
    let user = req.session.user;
    console.log(user);
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("users/home", { products, user });
    });
  },

  getLogin: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("users/login", { loginErr: req.session.loginErr });
      req.session.loginErr = false;
    }
  },

  getSignup: (req, res) => {
    res.render("users/signup");
  },

  postSignup: (req, res) => {
    userHelper.doSignup(req.body).then((response) => {
      console.log(response);
    });
  },

  postLogin: (req, res) => {
    userHelper.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      } else {
        req.session.loginErr = "Invalid email address or password";
        res.redirect("/login");
      }
    });
  },

  getLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },

  getCart: (req, res) => {
    res.render("users/cart");
  },
};
