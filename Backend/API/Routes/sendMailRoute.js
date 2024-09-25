const express = require('express');
const { sendEmail } = require('../Controllers/sendMailController'); 

const router = express.Router();

router.post('/send', sendEmail);

module.exports = router;
