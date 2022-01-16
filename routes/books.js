var express = require('express');
var router = express.Router();
const BookController = require('../controllers/book.controller');



/* GET book list. */
router.get('/', BookController.getBookList);

/* GET book detail. */
router.get('/:id/detail', BookController.getBookById);

// router.post('/:id/comments', BookController.createComment);

// router.get('/search', BookController.searchBooks);
module.exports = router;
