const nodemailer = require('nodemailer');

// Outlook SMTP configuration
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

// Verify connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error.message);
    } else {
        console.log('✅ Email server ready to send messages');
    }
});

/**
 * Send email with Outlook SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise}
 */
async function sendMail({ to, subject, html, text }) {
    try {
        const mailOptions = {
            from: `"CoreLogic Labs" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text fallback
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email send failed:', error.message);
        throw error;
    }
}

module.exports = { sendMail, transporter };
