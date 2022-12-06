const productHelper = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");
const orderHelper = require("../helpers/orderHelper");
const adminUserHelper = require("../helpers/adminUserHelpers");
const adminHelper = require("../helpers/adminHelpers");
const { response } = require("express");
const { Db } = require("mongodb");

module.exports = {
  getAdminHome: async (req, res) => {
    const requests = await adminUserHelper.cancelRequests();
    const users = await adminUserHelper.getAllUsers();
    const orders = await adminUserHelper.getAllOrders();
    const totalRevenue = await adminHelper.totalRevenue();
    const topSellers = await adminHelper.topSellers();
    const ordersDate = await adminHelper.ordersDate();
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    const products = await productHelper.getAllProducts();
    if (!adminData) {
      res.render("admin/adminLogin", { admin: true });
    } else {
      res.render("admin/adminHome", {
        admin: true,
        adminData,
        reqNo,
        totalUsers,
        totalOrders,
        totalRevenue,
        topSellers,
        ordersDate,
        returnsNo,
        orders,
        products,
      });
    }
  },

  getViewProduct: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("admin/viewProducts", {
        products,
        admin: true,
        adminData,
        reqNo,
        returnsNo,
      });
    });
  },

  getViewUser: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    adminUserHelper.getAllUsers().then((users) => {
      res.render("admin/viewUsers", {
        users,
        admin: true,
        adminData,
        reqNo,
        returnsNo,
      });
    });
  },

  getAddProduct: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    let categories = await productHelper.getAllCategories();
    res.render("admin/addProduct", {
      admin: true,
      adminData,
      reqNo,
      categories,
      returnsNo,
    });
  },

  postAddProduct: (req, res) => {
    // console.log(req.body);
    // console.log(req.files.Image);

    productHelper.addProduct(req.body, (id) => {
      let image1 = req.files.Image1;
      let image2 = req.files.Image2;
      let image3 = req.files.Image3;
      let image4 = req.files.Image4;

      let id1 = id;
      let id2 = id + "a";
      let id3 = id + "b";
      let id4 = id + "c";

      console.log(`${id1}\n${id2}\n${id3}\n${id4}`);

      // image1.mv("./public/users/productImages/" + id1 + ".jpg", (err, done) => {
      //   if (!err) {
      //     res.redirect("/admin");
      //   } else {
      //     console.log(err);
      //   }
      // });
      // image2.mv("./public/users/productImages/" + id2 + ".jpg", (err, done) => {
      //   if (!err) {
      //     res.redirect("/admin");
      //   } else {
      //     console.log(err);
      //   }
      // });
      // image3.mv("./public/users/productImages/" + id3 + ".jpg", (err, done) => {
      //   if (!err) {
      //     res.redirect("/admin");
      //   } else {
      //     console.log(err);
      //   }
      // });
      // image4.mv("./public/users/productImages/" + id4 + ".jpg", (err, done) => {
      //   if (!err) {
      //     res.redirect("/admin");
      //   } else {
      //     console.log(err);
      //   }
      // });

      // try {
      //   image1.mv(
      //     "./public/users/productImages/" + id1 + ".jpg",
      //     (err, done) => {
      //       try {
      //         if (!err) {
      //           image2.mv(
      //             "./public/users/productImages/" + id2 + ".jpg",
      //             (err, done) => {
      //               try {
      //                 if (!err) {
      //                   image3.mv(
      //                     "./public/users/productImages/" + id3 + ".jpg",
      //                     (err, done) => {
      //                       try {
      //                         if (!err) {
      //                           image4.mv(
      //                             "./public/users/productImages/" +
      //                               id4 +
      //                               ".jpg",
      //                             (err, done) => {
      //                               try {
      //                                 if (!err) {
      //                                   res.redirect("/admin/view-product");
      //                                 } else {
      //                                   console.log(err);
      //                                 }
      //                               } catch (err) {
      //                                 if (!err) {
      //                                   res.redirect("/admin/view-product");
      //                                 } else {
      //                                   console.log(err);
      //                                 }
      //                               }
      //                             }
      //                           );
      //                         } else {
      //                           console.log(err);
      //                         }
      //                       } catch (err) {
      //                         res.redirect("/admin/view-product");
      //                       }
      //                     }
      //                   );
      //                 } else {
      //                   console.log(err);
      //                 }
      //               } catch {
      //                 res.redirect("/admin/view-product");
      //               }
      //             }
      //           );
      //         } else {
      //           console.log(err);
      //         }
      //       } catch (err) {
      //         res.redirect("/admin/view-product");
      //       }
      //     }
      //   );
      // } catch (err) {
      //   res.redirect("/admin/view-product");
      // }

      try {
        image1.mv("./public/users/productImages/" + id1 + ".jpg");
        image2.mv("./public/users/productImages/" + id2 + ".jpg");
        image3.mv("./public/users/productImages/" + id3 + ".jpg");
        image4.mv("./public/users/productImages/" + id4 + ".jpg");
        res.redirect("/admin/view-product");
      } catch (err) {
        res.redirect("/admin/view-product");
      }
    });
  },

  getDeleteProduct: (req, res) => {
    let proId = req.params.id;
    console.log(proId);
    productHelper.deleteProduct(proId).then((response) => {
      res.redirect("/admin/view-product");
    });
  },

  getEditProduct: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    let proId = req.params.id;
    let product = await productHelper.getOneProduct(proId);
    let categories = await productHelper.getAllCategories();
    res.render("admin/editProduct", {
      admin: true,
      product,
      adminData,
      reqNo,
      categories,
      returnsNo,
    });
  },

  postEditProduct: (req, res) => {
    let proId = req.params.id;
    productHelper.updateProduct(proId, req.body).then((response) => {
      const id1 = proId;
      const id2 = proId + "a";
      const id3 = proId + "b";
      const id4 = proId + "c";
      try {
        let image1 = req.files.Image1;
        image1.mv("./public/users/productImages/" + id1 + ".jpg");
        let image2 = req.files.Image2;
        image2.mv("./public/users/productImages/" + id2 + ".jpg");
        let image3 = req.files.Image3;
        image3.mv("./public/users/productImages/" + id3 + ".jpg");
        let image4 = req.files.Image4;
        image4.mv("./public/users/productImages/" + id4 + ".jpg");
        res.redirect("/admin/view-product");
      } catch (err) {
        res.redirect("/admin/view-product");
      }
    });
  },

  updateToBlockUser: (req, res) => {
    let proId = req.params.id;
    adminUserHelper.blockUser(proId).then((response) => {
      res.redirect("/admin/view-users");
    });
  },

  updateToUnblockUser: (req, res) => {
    let proId = req.params.id;
    adminUserHelper.unblockUser(proId).then((response) => {
      res.redirect("/admin/view-users");
    });
  },

  getAdminSignup: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    res.render("admin/adminSignup", {
      admin: true,
      adminData,
      reqNo,
      returnsNo,
    });
  },

  getAdminLogin: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    if (req.session.loggedIn) {
      res.redirect("/admin");
    } else {
      res.render("admin/adminlogin", {
        admin: true,
        loginErr: req.session.loginErr,
        reqNo,
        returnsNo,
      });
      req.session.loginErr = false;
    }
  },

  postAdminSignup: (req, res) => {
    adminHelper.adminSignup(req.body).then((response) => {
      console.log(response);
      res.redirect("/admin/login");
    });
  },

  postAdminLogin: (req, res) => {
    adminHelper.adminLogin(req.body).then((response) => {
      if (response.status) {
        req.session.admin = response.admin;
        req.session.loggedIn = true;
        console.log(req.session.admin);
        res.redirect("/admin");
      } else {
        req.session.loginErr = "Invalid username or password";
        res.redirect("/admin/login");
      }
    });
  },

  getAdminLogout: (req, res) => {
    req.session.admin = null;
    res.redirect("/admin");
  },

  getViewCategory: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    productHelper.getAllCategories().then((categories) => {
      res.render("admin/viewCategory", {
        admin: true,
        adminData,
        categories,
        reqNo,
        returnsNo,
      });
    });
  },

  getAddCategory: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    let adminData = req.session.admin;
    res.render("admin/addCategory", {
      admin: true,
      adminData,
      reqNo,
      returnsNo,
    });
  },

  postAddCategory: (req, res) => {
    console.log(req.body);
    productHelper
      .addCategory(req.body)
      .then((result) => {
        console.log("Category Added");
        res.redirect("/admin/view-category");
      })
      .catch((err) => {
        let adminData = req.session.admin;
        res.render("admin/addCategory", { err, admin: true, adminData });
      });
  },

  getDeleteCategory: (req, res) => {
    const catId = req.params.id;
    console.log(catId);
    productHelper.deleteCategory(catId).then((response) => {
      res.redirect("/admin/view-category");
    });
  },

  getDeleteSubcategory: (req, res) => {
    const cat = req.params.ctgry;
    const sub = req.params.subctgry;
    console.log(cat, sub);
    productHelper.deleteSubcategory(cat, sub).then((response) => {
      res.redirect("/admin/view-category");
    });
  },

  getEditCategory: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    const catId = req.params.id;
    const category = await productHelper.getOneCategory(catId);
    res.render("admin/editCategory", {
      admin: true,
      adminData,
      category,
      reqNo,
      returnsNo,
    });
  },

  postEditCategory: (req, res) => {
    const catId = req.params.id;
    productHelper.updateCategory(catId, req.body).then((response) => {
      let adminData = req.session.admin;
      res.redirect("/admin/view-category");
    });
  },

  getAllOrders: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    const orders = await adminUserHelper.getAllOrders();
    res.render("admin/viewOrders", {
      admin: true,
      adminData,
      orders,
      reqNo,
      returnsNo,
    });
  },

  postSetStatus: (req, res) => {
    const status = req.body.status;
    const orderId = req.body.orderId;
    console.log(status, orderId);
    adminUserHelper.setStatus(status, orderId).then((response) => {
      const message = `EXPOstore : Your order:${orderId} is ${status}`;
      orderHelper.sendMessage(req.body.mobile, message);
      // console.log(response);
      res.json(response);
    });
  },

  getCancelRequests: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    res.render("admin/viewRequests", {
      admin: true,
      requests,
      adminData,
      reqNo,
      returnsNo,
    });
  },

  getViewOrderProducts: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    let order = await userHelper.getSingleOrder(req.params.id);
    let products = await userHelper.getOrderProducts(req.params.id);
    res.render("admin/viewOrderProducts", {
      admin: true,
      requests,
      adminData,
      reqNo,
      products,
      order,
      returnsNo,
    });
  },

  getCoupons: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    const coupons = await adminHelper.getAllCoupons();
    res.render("admin/viewCoupons", {
      admin: true,
      requests,
      adminData,
      reqNo,
      returnsNo,
      coupons,
    });
  },

  postAddCoupon: async (req, res) => {
    adminHelper.addCoupon(req.body).then((response) => {
      console.log("Coupon added", response);
      res.json({ added: "success" });
    });
  },

  postDeleteCoupon: async (req, res) => {
    adminHelper.deleteCoupon(req.body).then((response) => {
      console.log(response);
      res.json({ deleted: "success" });
    });
  },

  getSingleCategory: (req, res) => {
    // console.log(req.body.category);
    adminHelper.getSingleCategory(req.body.category).then((response) => {
      res.json(response);
    });
  },

  getAllReturnRequests: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    let returns = await adminHelper.allReturnRequests();
    const returnsNo = returns.length;
    returns = returns.reverse();
    const adminData = req.session.admin;
    console.log(returns);
    console.log("Number of returns = " + returnsNo);
    res.render("admin/viewReturnRequests", {
      admin: true,
      adminData,
      returns,
      returnsNo,
      reqNo,
    });
  },

  postAcceptReturn: (req, res) => {
    console.log(req.body);
    adminHelper.acceptReturn(req.body).then((response) => {
      const message = `EXPOstore : Your return request for order:${req.body.orderId} is accepted`;
      orderHelper.sendMessage(req.body.mobile, message);
      res.json(response);
    });
  },

  getAddBanner: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    let returns = await adminHelper.allReturnRequests();
    const banners = await adminHelper.allBanners();
    const returnsNo = returns.length;
    const adminData = req.session.admin;
    res.render("admin/viewBanners", {
      admin: true,
      adminData,
      returnsNo,
      reqNo,
      banners,
    });
  },

  postAddBanner: (req, res) => {
    // console.log(req.body);
    // console.log(req.files.banner);

    adminHelper.addBanner(req.body).then((id) => {
      console.log("Inserted Id : " + id);
      let banner = req.files.banner;
      try {
        banner.mv("./public/users/images/banners/" + id + ".png");
        res.redirect("/admin/banners");
      } catch (err) {
        console.log(err);
      }
    });
  },

  postDeleteBanner: (req, res) => {
    adminHelper.deleteBanner(req.body).then((response) => {
      console.log(response);
      res.json({ deleted: "success" });
    });
  },
};
