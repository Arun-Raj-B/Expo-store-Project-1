const productHelper = require("../helpers/productHelpers");
const adminUserHelper = require("../helpers/adminUserHelpers");

module.exports = {
  getAdminHome: (req, res) => {
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("admin/adminHome", { products, admin: true });
    });
  },

  getViewProduct: (req, res) => {
    productHelper.getAllProducts().then((products) => {
      // console.log(products);
      res.render("admin/viewProducts", { products, admin: true });
    });
  },

  getViewUser: (req, res) => {
    adminUserHelper.getAllUsers().then((users) => {
      res.render("admin/viewUsers", { users, admin: true });
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
};
