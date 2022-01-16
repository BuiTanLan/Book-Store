var express = require('express');
var router = express.Router();
const bookApiController = require('../../controllers/api/book-api-controller');

router.post('/post-comment', bookApiController.postComment)

module.exports = router;
