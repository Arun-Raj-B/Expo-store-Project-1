const productHelper = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");
const otpHelper = require("../helpers/otpHelper");

module.exports = {
  getHome: async (req, res) => {
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    const category = await productHelper.getAllCategories();
    console.log(category);
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("users/home", {
        products,
        user,
        category,
        cartCount,
        wishlistCount,
      });
    });
  },

  getLogin: (req, res) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.render("users/login", { loginErr: req.session.loginErr });
      req.session.loginErr = false;
    }
  },

  getSignup: (req, res) => {
    if (req.session.user) {
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
          res.redirect("/verifyNo");
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

  getCart: async (req, res) => {
    let userId = req.session.user._id;
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    let cartItems = await userHelper.getCartProducts(userId);
    console.log(cartItems);
    res.render("users/cart", { user, cartItems, cartCount, wishlistCount });
  },

  getAddToCart: (req, res) => {
    const proId = req.params.id;
    const userId = req.session.user._id;
    // console.log(id, userId);
    userHelper.addToCart(proId, userId).then(() => {
      res.json({ status: true });
      // res.redirect("/");
    });
  },

  getWishlist: async (req, res) => {
    let userId = req.session.user._id;
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    let wishlistItems = await userHelper.getWishlistProducts(userId);
    console.log(wishlistItems);
    res.render("users/wishlist", {
      user,
      wishlistItems,
      cartCount,
      wishlistCount,
    });
  },

  getAddToWishlist: (req, res) => {
    const proId = req.params.id;
    const userId = req.session.user._id;
    // console.log(id, userId);
    userHelper.addToWishlist(proId, userId).then(() => {
      res.json({ status: true });
      // res.redirect("/");
    });
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

  getVerifyNo: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      const last4digits = req.session.last4digits;
      console.log(otpHelper.obj);
      if (!req.session.OTPerr) {
        res.render("users/verifyNo", { last4digits });
      } else {
        const OTPerr = req.session.OTPerr;
        res.render("users/verifyNo", { last4digits, OTPerr });
      }
    }
  },

  postVerifyNo: (req, res) => {
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
      res.redirect("/verifyNo");
    }
  },

  getGetMobile: (req, res) => {
    res.render("users/getMobile");
  },

  postGetMobile: (req, res) => {
    console.log(req.body.mobilenumber);
    userHelper.checkNoExist(req.body.mobilenumber).then((user) => {
      if (user) {
        const mobile = user.mobilenumber;
        req.session.mobile = mobile;
        req.session.tempUser = user;
        res.redirect("/loginOTP");
      } else {
        const loginErr = "User does not exist";
        res.render("users/getMobile", { loginErr });
      }
    });
  },

  getLoginOTP: (req, res) => {
    const mobile = req.session.mobile;
    otpHelper.obj.OTP = otpHelper.sendMessage(mobile);
    res.render("users/loginOTP", { mobile });
  },

  postLoginOTP: (req, res) => {
    const mobile = req.session.mobile;
    const enteredOTP = req.body.OTP;
    const sentOTP = otpHelper.obj.OTP;
    console.log(enteredOTP, sentOTP);
    if (enteredOTP == sentOTP) {
      req.session.loggedIn = true;
      req.session.user = req.session.tempUser;
      req.session.tempUser = null;
      res.redirect("/");
    } else {
      const errMsg = "Enter a valid OTP";
      res.render("users/loginOTP", { mobile, errMsg });
    }
  },

  getSingleProduct: (req, res) => {
    const proId = req.params.id;
    console.log(proId);
    productHelper.getOneProduct(proId).then((prod) => {
      console.log(prod);
      // const product = prod._id.toString();
      // console.log(product);
      res.render("users/singleProduct", { prod });
    });
  },
};
