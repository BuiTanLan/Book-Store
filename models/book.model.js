const Book = require("../databases/book");
const Author = require("../databases/author");
const Category = require("../databases/category");
const mongoose = require("mongoose");
const dateFormat = require("dateformat");

const LIMIT = 8;

//True if exists
async function CheckBookExists(bookId) {
  console.log("book Id: ", bookId);
  const isBookExists = await Book.exists({ id: bookId });
  return isBookExists;
}

async function find_idByid(bookId) {
  console.log("book Id: ", bookId);
  const book = await Book.find({ id: id });
  return book._id;
}

//return id if exists
async function validateAuthor(authorId) {
  const id = mongoose.Types.ObjectId(authorId);
  const isExists = await Author.exists({ _id: id });
  if (isExists) {
    console.log("author is valided");
    return id;
  } else {
    return -1;
  }
}

async function validateCategory(categoryId) {
  const id = mongoose.Types.ObjectId(categoryId);
  const isExists = await Category.exists({ _id: id });
  if (isExists) {
    return id;
  } else {
    return -1;
  }
}

async function validateBookInfo(bookInfo) {
  console.log("validate BookInfo ", bookInfo);
  const newBook = bookInfo;

  //start add author id to newBook
  //check author exists
  //return author id if valid
  console.log("validate author");
  const authorId = await validateAuthor(bookInfo.author);
  if (authorId === -1) {
    return -1;
  }
  newBook.author = authorId;
  //end author

  //begin add category to newBook
  //check category exists
  //return categoryId if valid
  const categoryArray = bookInfo.category;
  const category = [];

  for (i of categoryArray) {
    const categoryId = await validateCategory(i);
    if (categoryId === -1) {
      return -1;
    }
    category.push(categoryId);
  }
  newBook.category = category;
  //end category

  console.log("new Book: ", newBook);

  return newBook;
}

module.exports = {
  getAllBook: async (filter) => {
    let query = {};
    query.show = true;
    if (filter.category) {
      query.category = filter.category;
    }
    if (filter.keyword) {
      const keyword = filter.keyword;
      query.name = new RegExp(keyword, "gi");
    }
    if (filter.pricerange) {
      const prices = filter.pricerange.split("-");
      // console.log(prices[0], " ", prices[1]);
      if (prices[1]) {
        query.price = { $gte: prices[0], $lte: prices[1] };
      } else {
        query.price = { $gte: prices[0] };
      }
    }
    const options = {
      populate: ["author", "category"],
      page: filter.page,
      limit: LIMIT,
    };
    if (filter.priceSort) {
      if (filter.priceSort == "asc") {
        options.sort = { price: "asc" };
      } else if (filter.priceSort == "desc") {
        options.sort = { price: "desc" };
      }
    }
    console.log("pre", options);
    let books;
    await Book.paginate(query, options).then(function (result) {
      console.log("result", result);
      books = result;
    });
    return books;
  },
  
  getBooksByOptions: async (options) =>{
    let query = {};
    query.show = true;
    // options.push(limit=6);
    console.log("pre", options);
    const books = await Book.paginate(query, options);
    return books;
  },

  getBookById: async (_id) => {
    const books = await Book.findOne({ _id: _id, show: true })
      .populate("author")
      .populate("category")
      .exec();
    console.log(books);
    return books;
  },
  getBookDetail: async (_id) => {
    let book = await Book.findOne({ _id: _id, show: true }, function (err, doc) {
      doc.views = doc.views + 1;
      doc.save();
    })
    book.comments.forEach(comment => {
      comment.dateFm = dateFormat(comment.date, "dd/mm/yyyy HH:MM");
    });
    book.totalCmts = book.comments.length;
    return book;
  },
  // return -1 if ID has been existed
  createANewBook: async (aNewBookInfo) => {
    console.log("Book info", aNewBookInfo);

    //check book exists
    const isBookExists = await CheckBookExists(aNewBookInfo.id);
    if (isBookExists) {
      return -1;
    }

    const aBook = await validateBookInfo(aNewBookInfo);
    if (aBook === -1) {
      return -1;
    }
    console.log("book is valid");

    console.log("book is creating");
    const bookDataRes = await Book.create(aBook);
    console.log("book is created");
    console.log(bookDataRes);
    return bookDataRes;
  },

  updateABook: async (bookInfo) => {
    try {
      //check book exists
      const isBookExists = await CheckBookExists(bookInfo.id);
      if (!isBookExists) {
        return -1;
      }
      const aBook = await validateBookInfo(bookInfo);
      if (aBook === -1) {
        return -1;
      }
      console.log("book is valid");

      console.log("book is updating");
      if (!aBook._id) {
        console.log("_id is required");
      }
      const bookDataRes = await Book.findByIdAndUpdate(aBook._id, aBook);
      console.log("book is updated");
      console.log(bookDataRes);
      return bookDataRes;
    } catch (error) {
      console.log("something went wrong!");
      console.log(error);
      return -1;
    }
  },

  deleteABook: async (id) => {
    try {
      const res = await Book.findByIdAndUpdate(id, { show: false });
      return res;
    } catch (error) {
      console.log("wrong");
      return -1;
    }
  },

  searchBooks: async (keyword, page) => {
    let query = {
      show: true,
      name: new RegExp(keyword, "gi"),
    };
    const options = {
      populate: ["author", "category"],
      page: page,
      limit: LIMIT,
    };

    // let results = [];
    // let books = await Book.find({})
    //   .populate('author')
    //   .populate('category')
    //   .exec();
    // for (let i = 0; i < books.length; i++) {
    //   let bookName = Search.removeAccents(books[i].name);
    //   if (bookName.includes(keyword)) {
    //     results.push(books[i]);
    //   }
    // }

    const result = await Book.paginate(query, options);

    return result;
  },

  addComment: async (bookId, comment) => {
    let result = false;

    try {
      const book = await Book.findOne({ _id: bookId, show: true });
      if (book) {
        book.comments.push(comment);
        await book.save();
        result = true;
      }
    } catch (error) {
      console.log('Error bookModel/addComment: ', error)
    }

    return result;
  },

  paginateBookComments: async (bookId, page, limit = 4) => {

  },

  getBooksByIds: async (ids) => {
    const books = await Book.find({
      '_id': { $in: ids }
    })

    return books;
  },

  updateBooksQuantity: async (items) => {
    let ids = []
    for (const item of items) {
      ids.push(item.bookId);
    }

    const books = await Book.find({
      '_id': { $in: ids }
    });

    for (const item of items) {
      const book = books.find(book => book._id.toString() === item.bookId.toString());
      // console.log("book: ", book);
      if (book) {
        if (book.quantity <= item.amount) {
          book.quantity = 0;
        } else {
          book.quantity -= item.amount;
        }
        book.quantity_sold += item.amount;
        await book.save();
      }
    }

  }

};
