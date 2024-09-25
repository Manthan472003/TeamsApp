const nodemailer = require('nodemailer'); 
const { EMAIL, PASSWORD } = require('../env.js');

const mailOptions = {
    from: EMAIL, 
    cc: 'deodhemanthan10@gmail.com',
    to: 'kendreparth8@gmail.com',
    subject: "Sending Email to Parth",
    text: "Welcome to NodeMailer, It's Working",
    html: '<h1>Welcome</h1><p>That was easy!</p>',
};   

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL, 
        pass: PASSWORD 
    }
});

// Send the mail
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log('Error occurred:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});