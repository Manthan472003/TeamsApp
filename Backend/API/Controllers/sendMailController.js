const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../env.js');

const sendEmail = (req, res) => {
    const { email, subject, text, html } = req.body; 

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    const logoUrl = 'https://teamsapp-media.s3.eu-north-1.amazonaws.com/media/Blue+White+Modern+Logistic+Email+Header.png'; // Your logo URL

    const header = `
        <header style="width: 100%; overflow: hidden;">
            <img src="${logoUrl}" alt="Copious Teams Logo" style="width: 100%; height: auto; display: block;">
        </header>`;

    const footer = `
        <footer style="background-color: #ffffff; border-top: 2px solid #007BFF; padding: 20px; text-align: center; font-family: 'Arial', sans-serif;">
            <p style="margin: 5px 0;">&copy; 2024 Copious Teams. All rights reserved.</p>
            <p style="margin: 5px 0; font-size: 14px;">Follow us on <a href="https://x.com/IncCopious" style="color: #007BFF; text-decoration: none;">X</a> | <a href="https://in.linkedin.com/company/copious-healthcare-inc" style="color: #007BFF; text-decoration: none;">LinkedIn</a> | <a href="https://www.facebook.com/copioushealthcareinc/" style="color: #007BFF; text-decoration: none;">Facebook</a></p>
        </footer>`;

    const mainContent = `
        <main style="padding: 20px; font-family: Arial, sans-serif;">
            ${html || '<h1>Welcome!</h1><p style="margin: 10px 0;">Thank you for signing up!</p>'}
        </main>`;

    const fullHtml = `
        ${header}
        ${mainContent}
        ${footer}
    `;

    const mailOptions = {
        from: EMAIL,
        to: email, 
        subject: subject || "Default Subject", 
        text: text || "Default text",
        html: fullHtml, 
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
