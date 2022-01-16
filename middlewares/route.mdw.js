const indexRouter = require("../routes/index");
const usersRouter = require("../routes/users");
const booksRouter = require("../routes/books");
const cartRouter = require("../routes/cart");

const userApiRouter = require("../routes/api/user-api")
const bookApiRouter = require("../routes/api/book-api")
const cartApiRouter = require("../routes/api/cart-api")

// const {logged} = require("../middlewares/auth.mdw");

module.exports = function (app) {
  // app.use(logged);
  app.use("/book", booksRouter);
  app.use("/users", usersRouter);
  app.use("/cart", cartRouter);
  app.use("/", indexRouter);

  app.use("/api/users", userApiRouter);
  app.use("/api/book", bookApiRouter);
  app.use("/api/cart", cartApiRouter);
};
