const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const userService = require('../service/user-service')
const userModel = require('../models/user.model')

passport.use(new LocalStrategy(
  { usernameField: "email" },
  async function (username, password, done) {
    const user = await userService.checkCredential(username, password)

    console.log("checkCredential result: ", user);

    if (!user) {
      return done(null, false, { message: 'Incorrect username or password' });
    }
    return done(null, user);
  })
)

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  userModel.getActivedUserInfo(id)
    .then(user => {
      done(null, user);
    })
});


module.exports = passport;