// const userService = require("../../service/user-service")
const userModel = require("../../models/user.model");
const bookModel = require("../../models/book.model")

exports.addBookToCart = async (req, res, next) => {
  const bookId = req.body.bookId;
  const amount = parseInt(req.body.amount);
  let result = {};

  if (req.isAuthenticated()) {
    result = await userModel.addBookToCart(req.user._id, { bookId, amount });
    result.isAuthenticated = true;
  } else {
    let isExists = false;
    if (!req.session.cart) {
      req.session.cart = [];
    }
    for (let goods of req.session.cart) {
      if (goods.bookId === bookId) {
        isExists = true;
        goods.amount += amount;
        break;
      }
    }
    if (!isExists) {
      req.session.cart.push({ bookId, amount });
    }

    result.status = true;
    result.isAuthenticated = false;
    result.cart = req.session.cart;
  }

  res.json(result);
}

exports.changeAmount = async (req, res, next) => {
  const bookId = req.body.bookId;
  const amount = parseInt(req.body.amount);
  let result = {};

  // console.log(bookId, amount)
  if (req.isAuthenticated()) {
    result = await userModel.updateGoodsAmount(req.user._id, { bookId, amount })
  } else {
    //update req.session.cart
    for (let goods of req.session.cart) {
      if (goods.bookId === bookId) {
        goods.amount = amount;
        break;
      }
    }

    let cart = [];
    for (let i = 0; i < req.session.cart.length; i++) {
      cart.push({ ...req.session.cart[i] })
    }
    let ids = [];
    for (const goods of cart) {
      ids.push(goods.bookId);
    }

    const books = await bookModel.getBooksByIds(ids);
    if (books) {
      let totalPrice = 0;
      for (let i = 0; i < cart.length; i++) {
        const book = books.find(book => book._id.toString() === cart[i].bookId);
        if (book) {
          cart[i].bookId = book;
          totalPrice += book.price * cart[i].amount;
        }
      }

      result.status = true;
      result.data = { cart, totalPrice };
    }
  }
  
  res.json(result);
}