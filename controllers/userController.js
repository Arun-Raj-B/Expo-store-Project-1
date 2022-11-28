const productHelper = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");
const otpHelper = require("../helpers/otpHelper");
const orderHelper = require("../helpers/orderHelper");
const { resolveInclude } = require("ejs");
const { urlencoded } = require("express");
const adminUserHelpers = require("../helpers/adminUserHelpers");
const paypalHelpers = require("../helpers/paypalHelpers");
const adminHelpers = require("../helpers/adminHelpers");

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
    let products = await userHelper.getCartProducts(userId);
    let totalAmount = await userHelper.getTotalAmount(user._id);
    console.log(products);
    res.render("users/cart", {
      user,
      products,
      cartCount,
      wishlistCount,
      totalAmount,
    });
  },

  getAddToCart: (req, res) => {
    try {
      const proId = req.params.id;
      const userId = req.session.user._id;
      // console.log(id, userId);
      userHelper.addToCart(proId, userId).then(() => {
        res.json({ status: true });
        // res.redirect("/");
      });
    } catch (err) {
      res.json({ status: false });
    }
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
    let products = await userHelper.getWishlistProducts(userId);
    console.log(products);
    res.render("users/wishlist", {
      user,
      products,
      cartCount,
      wishlistCount,
    });
  },

  getAddToWishlist: (req, res) => {
    try {
      const proId = req.params.id;
      const userId = req.session.user._id;
      // console.log(id, userId);
      userHelper.addToWishlist(proId, userId).then(() => {
        res.json({ status: true });
        // res.redirect("/");
      });
    } catch (err) {
      res.json({ status: false });
    }
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

  getSingleProduct: async (req, res) => {
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }

    const proId = req.params.id;
    console.log(proId);
    productHelper.getOneProduct(proId).then((prod) => {
      console.log(prod);
      // const product = prod._id.toString();
      // console.log(product);
      res.render("users/singleProduct", {
        user,
        cartCount,
        wishlistCount,
        prod,
      });
    });
  },

  postChangeCartProductQuantity: (req, res, next) => {
    userHelper.ChangeCartProductQuantity(req.body).then(async (response) => {
      let userId = req.body.user;
      let total = await userHelper.getTotalAmount(userId);
      // console.log(total);
      res.json({ response, total });
    });
  },

  postChangeWishlistProductQuantity: (req, res, next) => {
    userHelper.ChangeWishlistProductQuantity(req.body).then((response) => {
      res.json(response);
    });
  },

  postRemoveCartProduct: (req, res) => {
    const cartId = req.params.cartId;
    const prodId = req.params.prodId;
    userHelper.removeCartProduct(cartId, prodId).then((response) => {
      res.redirect("/cart");
    });
  },

  postRemoveWishlistProduct: (req, res) => {
    const wishlistId = req.params.wishlistId;
    const prodId = req.params.prodId;
    userHelper.removeWishlistProduct(wishlistId, prodId).then((response) => {
      res.redirect("/wishlist");
    });
  },

  postWishlistToCart: (req, res) => {
    console.log(req.session.user._id);
    const product = req.body.product;
    const wishlist = req.body.wishlist;
    const user = req.session.user._id;
    userHelper.wishlistToCart(user, product, wishlist).then((response) => {
      // console.log(response);
      res.json(response);
    });
  },

  getplaceOrder: async (req, res) => {
    let user = await userHelper.findUser(req.session.user._id);
    let cartCount = 0;
    let wishlistCount = 0;
    console.log(user);
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    let totalAmount = await userHelper.getTotalAmount(user._id);
    console.log(totalAmount);
    let coupons = await adminHelpers.getAllCoupons();
    res.render("users/placeOrder", {
      user,
      cartCount,
      wishlistCount,
      totalAmount,
      coupons,
    });
  },

  postplaceOrder: async (req, res) => {
    console.log(req.body);
    let products = await userHelper.getCartProductList(req.body.userId);
    let totalAmount = await userHelper.getTotalAmount(req.body.userId);
    console.log(typeof totalAmount);
    userHelper.placeOrder(req.body, products, totalAmount).then((orderId) => {
      if (req.body.paymentMethod == "COD") {
        const message = `Thanks for purchasing from EXPOstore. Your order has been placed successfully`;
        orderHelper.sendMessage(req.body.mobile, message);
        res.json({ codSuccess: true });
      } else if (req.body.paymentMethod == "RAZORPAY") {
        userHelper.generateRazorpay(orderId, totalAmount).then((response) => {
          res.json(response);
        });
      } else {
        const mobile = req.body.mobile;
        res.json({ paypal: true, orderId, mobile });
      }
    });
  },

  getOrders: async (req, res) => {
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    let orders = await userHelper.getUserOrders(user._id);
    res.render("users/orders", { user, cartCount, wishlistCount, orders });
  },

  getViewOrderProducts: async (req, res) => {
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    let order = await userHelper.getSingleOrder(req.params.id);
    let products = await userHelper.getOrderProducts(req.params.id);
    res.render("users/orderProducts", {
      user,
      cartCount,
      wishlistCount,
      products,
      order,
    });
  },

  postCancelOrder: (req, res) => {
    const orderId = req.body.orderId;
    userHelper.cancelOrder(orderId).then((response) => {
      console.log(response);
      const message = `Your cancel request for the order ID : ${orderId} is being processed.`;
      orderHelper.sendMessage(req.body.mobile, message);
      res.json(response);
    });
  },

  getCategoryProducts: async (req, res) => {
    const category = await productHelper.getAllCategories();
    const products = await productHelper.getCategoryProducts(req.params.id);
    let user = req.session.user;
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    res.render("users/categoryProducts", {
      products,
      user,
      category,
      cartCount,
      wishlistCount,
    });
  },

  postSaveAddress: (req, res) => {
    userHelper.saveAddress(req.body).then((response) => {
      res.json(response);
    });
  },

  postverifyPayment: (req, res) => {
    console.log(req.body);

    const paymentId = req.body["payment[razorpay_payment_id]"];
    const orderId = req.body["order[receipt]"];
    userHelper
      .setPaymentId(paymentId, orderId)
      .then(() => {
        console.log("To verify payment");
      })
      .catch(() => {
        console.log("some error happened");
      });
    userHelper
      .verifyPayment(req.body)
      .then(() => {
        adminUserHelpers
          .setStatus("Placed", req.body["order[receipt]"])
          .then(() => {
            console.log("Payment Success");
            res.json({ status: true });
          })
          .catch((err) => {
            console.log(err);
            console.log(err);
            console.log(err);
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, errMsg: "Some error happened" });
      });
  },

  postPaypalOrder: async (req, res) => {
    const totalAmount = req.params.total;
    const order = await paypalHelpers.createOrder(totalAmount);
    res.json(order);
  },

  postApprove: async (req, res) => {
    const { orderID } = req.params;
    const captureData = await paypalHelpers.capturePayment(orderID);
    // TODO: store payment information such as the transaction ID
    res.json(captureData);
  },

  getProfile: async (req, res) => {
    let user = await userHelper.findUser(req.session.user._id);
    let cartCount = 0;
    let wishlistCount = 0;
    if (user) {
      cartCount = await userHelper.getCartCount(req.session.user._id);
      wishlistCount = await userHelper.getWishlistCount(req.session.user._id);
    }
    const category = await productHelper.getAllCategories();
    console.log(category);
    res.render("users/userprofile", {
      user,
      category,
      cartCount,
      wishlistCount,
    });
  },

  postDeleteAddress: (req, res) => {
    userHelper
      .deleteAddress(req.body)
      .then(() => {
        res.json({ updated: true });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  postEditEmail: (req, res) => {
    userHelper
      .editEmail(req.body)
      .then(() => {
        res.json({ updated: true });
      })
      .catch(() => {
        res.json({ updated: false });
      });
  },

  postEditMobile: (req, res) => {
    userHelper
      .editMobile(req.body)
      .then(() => {
        res.json({ updated: true });
      })
      .catch(() => {
        res.json({ updated: false });
      });
  },
};
