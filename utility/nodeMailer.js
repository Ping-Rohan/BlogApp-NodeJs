const nodemailer = require('nodemailer');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (email, confirmationLink) => {
    await transporter.sendMail({
        from: 'MediaAccess Nepal',
        to: email,
        subject: 'Email Verification Token',
        html: `<h1>Email Verification Link<h1>
                <p>If you were requested to verify the email address click on this link <a>${confirmationLink}</a> , Otherwise ignore this mail`,
    });
};

module.exports = sendEmail;
