module.exports = {
  authLogin: async (req, res, next) => {
    if (req.isAuthenticated()) {
      // res.locals.user = await req.user;
      // console.log("auth sucess");
      return next();
    }
    console.log("what");
    req.flash('error_msg', 'Please no log in');
    res.redirect('/users/login');
  },
  authNotLogin: (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    }
  },
  logged: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
    next();
  },

  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.render('user/login');
    }
  }
}