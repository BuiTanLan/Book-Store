const { populate } = require('../databases/bill');
const Bill = require('../databases/bill');
const Book = require('../databases/book')

module.exports = {
  createBill: async (bill) => {
    // console.log(bill);
    return await Bill.create(bill)
  },

  getBillByUser: async (userId) => {
    const bill = await Bill.find({ userId: userId })
    .populate({
      path: 'books',
      populate: {
        path: 'bookId',
        model: 'Book'
      }
    })
    .exec();
    return bill;
  }
}