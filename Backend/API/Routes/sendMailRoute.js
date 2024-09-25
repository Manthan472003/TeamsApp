const router = require('express').Router();
const { signup, getbill } = require('../Controllers/sendMail');

/** HTTP Requests */
router.post('/user/signup', signup);
router.post('/product/getbill', getbill);

module.exports = router;