const productHelper = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");
const otpHelper = require("../helpers/otpHelper");

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
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("users/signup");
    }
  },

  postSignup: (req, res) => {
    userHelper
      .doSignup(req.body)
      .then((response) => {
        console.log(response);
        const mobile = req.body.mobilenumber;
        const last4digits = mobile.slice(6, 10);
        req.session.last4digits = last4digits;
        console.log(mobile);
        req.session.mobile = mobile;
        otpHelper.obj.OTP = otpHelper.sendMessage(mobile);
        // res.redirect("/login");
        res.redirect("/otp");
      })
      .catch((Err) => {
        res.render("users/signup", { Err });
      });
  },

  postLogin: (req, res) => {
    userHelper.doLogin(req.body).then((response) => {
      if (response.status) {
        if (!response.user.isVerified) {
          const mobile = response.user.mobilenumber;
          const last4digits = mobile.slice(6, 10);
          req.session.last4digits = last4digits;
          otpHelper.obj.OTP = otpHelper.sendMessage(mobile);
          req.session.mobile = mobile;
          res.redirect("/loginOTP");
        } else if (!response.user.access) {
          blockedMessage = "You are blocked";
          res.render("users/login", { access: false, blockedMessage });
        } else {
          req.session.loggedIn = true;
          req.session.user = response.user;
          res.redirect("/");
        }
      } else {
        req.session.loginErr = "Invalid email address or password";
        res.redirect("/login");
      }
    });
  },

  getLogout: (req, res) => {
    // req.session.destroy();
    req.session.user = null;
    res.redirect("/");
  },

  getCart: (req, res) => {
    res.render("users/cart");
  },

  getOTP: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      const last4digits = req.session.last4digits;
      console.log(otpHelper.obj);
      if (!req.session.OTPerr) {
        res.render("users/otp", { last4digits });
      } else {
        const OTPerr = req.session.OTPerr;
        res.render("users/otp", { last4digits, OTPerr });
      }
    }
  },

  postOTP: (req, res) => {
    const OTP = otpHelper.obj.OTP;
    if (req.body.otp == OTP) {
      mobile = req.session.mobile;
      userHelper.doVerify(mobile).then((response) => {
        req.session.OTPerr = null;
        res.redirect("/login");
      });
    } else {
      req.session.OTPerr = "Entered a valid OTP";
      res.redirect("/otp");
    }
  },

  getLoginOTP: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      const last4digits = req.session.last4digits;
      console.log(otpHelper.obj);
      if (!req.session.OTPerr) {
        res.render("users/loginOTP", { last4digits });
      } else {
        const OTPerr = req.session.OTPerr;
        res.render("users/loginOTP", { last4digits, OTPerr });
      }
    }
  },

  postLoginOTP: (req, res) => {
    const OTP = otpHelper.obj.OTP;
    if (req.body.otp == OTP) {
      mobile = req.session.mobile;
      console.log(mobile);
      userHelper.doVerify(mobile).then((response) => {
        res.redirect("/login");
        req.session.OTPerr = null;
      });
    } else {
      req.session.OTPerr = "Entered a valid OTP";
      res.redirect("/loginOTP");
    }
  },
};
