var express = require('express');
var router = express.Router();

const cartApiController = require('../../controllers/api/cart-api-controller');

router.post('/add-to-cart', cartApiController.addBookToCart);
router.post('/change-amount', cartApiController.changeAmount)

module.exports = router;