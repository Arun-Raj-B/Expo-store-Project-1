const productHelper = require("../helpers/productHelpers");
const adminUserHelper = require("../helpers/adminUserHelpers");
const adminHelper = require("../helpers/adminHelpers");

module.exports = {
  getAdminHome: (req, res) => {
    let adminData = req.session.admin;
    if (!adminData) {
      res.render("admin/adminLogin", { admin: true });
    } else {
      res.render("admin/adminHome", { admin: true, adminData });
    }
  },

  getViewProduct: (req, res) => {
    let adminData = req.session.admin;
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("admin/viewProducts", { products, admin: true, adminData });
    });
  },

  getViewUser: (req, res) => {
    let adminData = req.session.admin;
    adminUserHelper.getAllUsers().then((users) => {
      res.render("admin/viewUsers", { users, admin: true, adminData });
    });
  },

  getAddProduct: (req, res) => {
    res.render("admin/addProduct", { admin: true });
  },

  postAddProduct: (req, res) => {
    // console.log(req.body);
    // console.log(req.files.Image);

    productHelper.addProduct(req.body, (id) => {
      let image = req.files.Image;

      let image1 = id;
      let image2 = id + "a";
      let image3 = id + "b";
      let image4 = id + "c";

      console.log(`${image1}\n${image2}\n${image3}\n${image4}`);

      image.mv(
        "./public/users/productImages/" + image1 + ".jpg",
        (err, done) => {
          if (!err) {
            res.redirect("/admin");
          } else {
            console.log(err);
          }
        }
      );

      // image[0].mv(
      //   "./public/users/productImages/" + image1 + ".jpg",
      //   (err, done) => {
      //     if (!err) {
      //       image[1].mv(
      //         "./public/users/productImages/" + image2 + ".jpg",
      //         (err, done) => {
      //           if (!err) {
      //             image[2].mv(
      //               "./public/users/productImages/" + image3 + ".jpg",
      //               (err, done) => {
      //                 if (!err) {
      //                   image[3].mv(
      //                     "./public/users/productImages/" + image4 + ".jpg",
      //                     (err, done) => {
      //                       if (!err) {
      //                         res.redirect("/admin");
      //                       } else {
      //                         console.log(err);
      //                       }
      //                     }
      //                   );
      //                 } else {
      //                   console.log(err);
      //                 }
      //               }
      //             );
      //           } else {
      //             console.log(err);
      //           }
      //         }
      //       );
      //     } else {
      //       console.log(err);
      //     }
      //   }
      // );
    });
  },

  getDeleteProduct: (req, res) => {
    let proId = req.params.id;
    console.log(proId);
    productHelper.deleteProduct(proId).then((response) => {
      res.redirect("/admin");
    });
  },

  getEditProduct: async (req, res) => {
    let proId = req.params.id;
    let product = await productHelper.getOneProduct(proId);
    res.render("admin/editProduct", { admin: true, product });
  },

  postEditProduct: (req, res) => {
    let proId = req.params.id;
    productHelper.updateProduct(proId, req.body).then((response) => {
      res.redirect("/admin");
      if (req.files.Image) {
        let image = req.files.Image;
        image.mv("./public/users/productImages/" + proId + ".jpg");
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

  getAdminSignup: (req, res) => {
    res.render("admin/adminSignup", { admin: true });
  },

  getAdminLogin: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/admin");
    } else {
      res.render("admin/adminlogin", {
        admin: true,
        loginErr: req.session.loginErr,
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
};
