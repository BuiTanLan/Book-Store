var express = require('express');
var router = express.Router();
const CartController = require('../controllers/cart.controller');
const { authLogin } = require('../middlewares/auth.mdw');

/* GET home page. */
router.get('/', CartController.getCart)

router.post('/delete-product/:bookId', CartController.deleteProductFromCart)

router.get('/checkout', authLogin, CartController.checkout);
router.post('/checkout', authLogin, CartController.order)

router.get('/wishlist', authLogin, CartController.wishlist);


module.exports = router;
