// standalone-test.mjs
import { createTransport } from 'nodemailer';
import { ConfidentialClientApplication } from '@azure/msal-node';
import * as dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

async function testMicrosoftEmail() {
    // MSAL configuration
    const msalConfig = {
        auth: {
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`
        }
    };

    try {
        // Get access token
        console.log('Getting access token...');
        const msalClient = new ConfidentialClientApplication(msalConfig);
        const tokenResponse = await msalClient.acquireTokenByClientCredential({
            scopes: ['https://outlook.office365.com/.default']
        });

        console.log('Access token acquired successfully');

        // Create transporter
        console.log('Creating mail transporter...');
        const transporter = createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: process.env.MICROSOFT_SENDER_EMAIL,
                clientId: process.env.MICROSOFT_CLIENT_ID,
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
                tenantId: process.env.MICROSOFT_TENANT_ID,
                accessToken: tokenResponse.accessToken
            },
            debug: true // Enable debug logs
        });

        // Send test email
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.MICROSOFT_SENDER_EMAIL,
            to: process.env.TEST_RECIPIENT_EMAIL,
            subject: 'Test Email from Microsoft SMTP',
            text: 'This is a test email from your Microsoft SMTP configuration.',
            html: `
                <h1>Test Email</h1>
                <p>This is a test email from your Microsoft SMTP configuration.</p>
                <p>If you're seeing this, your setup is working correctly!</p>
            `
        });

        console.log('Message sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('Error occurred:', error);
        if (error.response) {
            console.error('SMTP Response:', error.response.data);
        }
    }
}

testMicrosoftEmail();