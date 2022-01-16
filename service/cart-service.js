const User = require('../databases/user')

exports.evaluateCart = async (userId) => {
  
}

exports.totalPrice = (cart) => {
  let total = 0;
  for (const goods of cart) {
    total += goods.bookId.price * goods.amount;
  }
  return total;
}