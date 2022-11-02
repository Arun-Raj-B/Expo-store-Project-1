const productHelper = require("../helpers/productHelpers");

module.exports = {
  getAdminHome: (req, res) => {
    productHelper.getAllProducts().then((products) => {
      console.log(products);
      res.render("admin/viewProducts", { products, admin: true });
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
};
