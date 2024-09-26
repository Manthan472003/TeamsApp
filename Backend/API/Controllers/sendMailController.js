const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../env.js');

const sendEmail = (req, res) => {
    const { email, subject, text, html } = req.body; 

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    const mailOptions = {
        from: EMAIL,
        to: email, 
        subject: subject || "Default Subject", 
        text: text || "Default text",
        html: html || '<h1>Welcome!</h1><p>Thank you for signing up!</p>', 
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD,
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            return res.status(500).send(`Error sending email: ${error.message}`);
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).send('Email sent successfully');
        }
    });
};

module.exports = { sendEmail };