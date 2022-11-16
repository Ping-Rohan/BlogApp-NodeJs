const nodemailer = require('nodemailer');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '35fd2fb02135d5',
        pass: '5f9b515a02e3f6',
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
