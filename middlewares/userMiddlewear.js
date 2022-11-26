module.exports = {
  verifyLogin: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  },
  redirectHome: (req, res, next) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      next();
    }
  },
};
