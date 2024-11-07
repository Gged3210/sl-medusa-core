const { ConfidentialClientApplication } = require('@azure/msal-node');
const nodemailer = require('nodemailer');

async function createTransporter() {
    // MSAL configuration
    const msalConfig = {
        auth: {
            clientId: process.env.MS_CLIENT_ID,
            clientSecret: process.env.MS_CLIENT_SECRET,
            authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}`,
        }
    };

    try {
        // Create MSAL application
        const cca = new ConfidentialClientApplication(msalConfig);

        // Get token with correct scope
        const tokenRequest = {
            scopes: ['https://outlook.office365.com/.default']
        };

        console.log('Requesting token with scope:', tokenRequest.scopes);

        const response = await cca.acquireTokenByClientCredential(tokenRequest);

        if (!response || !response.accessToken) {
            throw new Error('Failed to acquire access token');
        }

        console.log('Token acquired successfully');
        console.log('Token info:', {
            tokenLength: response.accessToken.length,
            tokenStart: response.accessToken.substring(0, 10) + '...',
            scopes: response.scopes
        });

        // Create Nodemailer transport
        const transport = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: process.env.MS_EMAIL,
                accessToken: response.accessToken,
            }
        });

        // Test the configuration
        console.log('Testing connection...');
        await transport.verify();
        console.log('Connection successful');

        return transport;
    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            responseCode: error.responseCode,
            response: error.response
        });
        throw error;
    }
}

module.exports = { createTransporter };