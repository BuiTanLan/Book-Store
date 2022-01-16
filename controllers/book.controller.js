const BookModel = require("../models/book.model");
const CategoryModel = require("../models/category.model");
// const Comment = require("../databases/comment");

module.exports = {
  getBookList: async (req, res, next) => {
    // console.log(ProductModel.get());
    const filter = {};
    console.log(req.query.page);
    filter.page = +req.query.page || 1;
    filter.category = req.query.category;
    filter.keyword = req.query.keyword;
    filter.pricerange = req.query.p;
    filter.priceSort = req.query.priceSort;
    console.log("filter", filter);

    console.log("get data...");
    const bookData = await BookModel.getAllBook(filter);
    console.log("get success, Data is: ", bookData.docs);

    bookData.bookList = bookData.docs;
    bookData.category = filter.category;

    bookData.categorys = await CategoryModel.getCategoryList();
    bookData.oldQuery = req.query;

    //console.log("locals", req.locals);
    //console.log("locals", req.session);
    console.log("query", req.query);
    res.render("book/book-list", bookData);
  },
  getBookById: async (req, res, next) => {
    const id = req.params.id;
    // console.log("Request params: ", req.params);
    //increase views by 1

    // const book = await BookModel.getBookById(id);
    // console.log(book);
    const book = await BookModel.getBookDetail(id);
    const bookData = await BookModel.getAllBook({ category: book.category[0]._id });

    const relatedBooks = bookData.docs;
    // res.send(book);
    res.render("book/book-detail", { book, relatedBooks });
  },
  searchBooks: async (req, res, next) => {
    let page = +req.query.page || 1;

    // const keyword = Search.removeAccents(req.query.keyword);
    const keyword = req.query.keyword;
    const bookData = await BookModel.searchBooks(keyword, page);
    // res.send(results);
    bookData.bookList = bookData.docs;
    // bookData.category = category;
    bookData.keyword = keyword;


    // bookData.categories = await CategoryModel.getCategoryList();
    res.render("./book/book-list", bookData);
    // res.send(bookData);

  },
  createComment: async (req, res, next) => {
    const id = req.params.id;
    const book = await BookModel.getBookById(id);

    if (!req.user) {
      book.comments = [...book.comments, req.body];
    }
    else {
      let comment = {};
      console.log(req.user.full_name);
      comment.name = req.user.full_name;
      
      comment.content = req.body.content;
      // res.send(book.comments);
      // book.comments = [...book.comments, req.body, name: req.user.full_name];

      book.comments = [...book.comments, comment];
    }
    await book.save();
    // res.json(book);
    res.redirect(`/book/${id}/detail`);
  }
};
