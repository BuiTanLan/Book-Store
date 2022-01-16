const userModel = require('../models/user.model')
const bookModel = require('../models/book.model');
const billModel = require('../models/bill.model')

// const cartService = require('../service/cart-service')

// const { getCartDetail } = require('../models/user.model');

module.exports = {
  getCart: async (req, res, next) => {
    if (req.isAuthenticated()) {
      const result = await userModel.getCartDetail(req.user._id);
      res.render('cart/cart', result);

    } else {
      const result = { status: false, message: "" }

      if (!req.session.cart) {
        req.session.cart = []
      }
      // let cart = [...req.session.cart];
      let cart = [];
      for (let i = 0; i < req.session.cart.length; i++) {
        cart.push({ ...req.session.cart[i] })
      }
      let ids = [];
      for (const goods of cart) {
        ids.push(goods.bookId);
      }

      const books = await bookModel.getBooksByIds(ids);
      // let data = { cart: [], totalPrice: 0 }
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

      console.log("cart: ", cart);
      console.log("req.session.cart: ", req.session.cart);
      res.render('cart/cart', result);
      // res.send(books);
    }
  },

  checkout: async (req, res, next) => {
    const cartDetail = await userModel.getCartDetail(req.user._id);
    res.render('cart/checkout', cartDetail);
  },

  wishlist: (req, res, next) => res.render('cart/wishlist'),

  deleteProductFromCart: async (req, res, next) => {
    const bookId = req.params.bookId;
    if (req.isAuthenticated()) {
      await userModel.deleteProductFromCart(req.user._id, bookId);
    } else {
      for (let i = 0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].bookId === bookId) {
          req.session.cart.splice(i, 1);
          break;
        }
      }
    }

    res.redirect('/cart');
  },

  order: async (req, res, next) => {
    const { full_name, email, phone_number, address, payment } = req.body;
    let message = "Order failed"

    try {
      const cartDetail = await userModel.getCartDetail(req.user._id);

      if (cartDetail.status && cartDetail.data.cart.length > 0) {
        const bill = {
          userId: req.user._id,
          books: req.user.cart,
          delivery_address: address,
          receiver: { full_name, phone_number },
          total_price: cartDetail.data.totalPrice,
          payment: payment
        };

        //create bill
        const result = await billModel.createBill(bill);
        if (result) {
          message = "Order Success. Your order is being processed"
          //update book quantity, quantity_sold
          await bookModel.updateBooksQuantity(result.books);
          //clear cart
          await userModel.clearCart(req.user._id);
        }
      }
    } catch (e) {
      console.log(e.toString())
    }

    res.render('cart/checkout-result', { message })
  }


}