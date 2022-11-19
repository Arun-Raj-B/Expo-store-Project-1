const productHelper = require("../helpers/productHelpers");
const userHelper = require("../helpers/userHelpers");
const adminUserHelper = require("../helpers/adminUserHelpers");
const adminHelper = require("../helpers/adminHelpers");
const { response } = require("express");

module.exports = {
  getAdminHome: async (req, res) => {
    const requests = await adminUserHelper.cancelRequests();
    const users = await adminUserHelper.getAllUsers();
    const orders = await adminUserHelper.getAllOrders();
    const totalRevenue = await adminHelper.totalRevenue();
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const reqNo = requests.length;
    const adminData = req.session.admin;
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
      });
    }
  },

  getViewProduct: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    let adminData = req.session.admin;
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("admin/viewProducts", {
        products,
        admin: true,
        adminData,
        reqNo,
      });
    });
  },

  getViewUser: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    let adminData = req.session.admin;
    adminUserHelper.getAllUsers().then((users) => {
      res.render("admin/viewUsers", { users, admin: true, adminData, reqNo });
    });
  },

  getAddProduct: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    let adminData = req.session.admin;
    res.render("admin/addProduct", { admin: true, adminData, reqNo });
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
    let adminData = req.session.admin;
    let proId = req.params.id;
    let product = await productHelper.getOneProduct(proId);
    res.render("admin/editProduct", { admin: true, product, adminData, reqNo });
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
    let adminData = req.session.admin;
    res.render("admin/adminSignup", { admin: true, adminData, reqNo });
  },

  getAdminLogin: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    if (req.session.loggedIn) {
      res.redirect("/admin");
    } else {
      res.render("admin/adminlogin", {
        admin: true,
        loginErr: req.session.loginErr,
        reqNo,
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
    let adminData = req.session.admin;
    productHelper.getAllCategories().then((categories) => {
      res.render("admin/viewCategory", {
        admin: true,
        adminData,
        categories,
        reqNo,
      });
    });
  },

  getAddCategory: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    let adminData = req.session.admin;
    res.render("admin/addCategory", { admin: true, adminData });
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
    const adminData = req.session.admin;
    const catId = req.params.id;
    const category = await productHelper.getOneCategory(catId);
    res.render("admin/editCategory", {
      admin: true,
      adminData,
      category,
      reqNo,
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
    const adminData = req.session.admin;
    const orders = await adminUserHelper.getAllOrders();
    res.render("admin/viewOrders", { admin: true, adminData, orders, reqNo });
  },

  postSetStatus: (req, res) => {
    const status = req.body.status;
    const orderId = req.body.orderId;
    console.log(status, orderId);
    adminUserHelper.setStatus(status, orderId).then((response) => {
      // console.log(response);
      res.json(response);
    });
  },

  getCancelRequests: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
    const adminData = req.session.admin;
    res.render("admin/viewRequests", {
      admin: true,
      requests,
      adminData,
      reqNo,
    });
  },

  getViewOrderProducts: async (req, res) => {
    let requests = await adminUserHelper.cancelRequests();
    const reqNo = requests.length;
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
    });
  },
};
