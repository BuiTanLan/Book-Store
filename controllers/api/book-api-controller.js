const BookModel = require("../../models/book.model");

exports.postComment = async (req, res, next) => {
  const bookId = req.body.bookId;
  const comment = { name: req.body.name, content: req.body.content }

  if (req.user) {
    comment.name = req.user.full_name;
  }

  const result = await BookModel.addComment(bookId, comment);
  res.json(result);

}