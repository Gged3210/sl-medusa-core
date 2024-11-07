require('dotenv').config();
const { createTransporter } = require('./oauth-config');

async function testEmail() {
    try {
        const transporter = await createTransporter();

        // Test the connection
        await transporter.verify();
        console.log('Connection verified');

        // Send test email
        const info = await transporter.sendMail({
            from: process.env.MS_EMAIL,
            to: 'edwin.fong@surplusloop.com', // Replace with your test email
            subject: 'OAuth2 Test',
            text: 'If you see this, OAuth2 is working!',
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error:', error);
    }
}

testEmail();