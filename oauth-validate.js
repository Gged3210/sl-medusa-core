require('dotenv').config();
const { ConfidentialClientApplication } = require('@azure/msal-node');

async function validateOAuthConfig() {
    // MSAL configuration
    const msalConfig = {
        auth: {
            clientId: process.env.MS_CLIENT_ID,
            clientSecret: process.env.MS_CLIENT_SECRET,
            authority: `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}`,
        }
    };

    console.log('Validating OAuth configuration...');

    try {
        // Create MSAL application
        const cca = new ConfidentialClientApplication(msalConfig);

        // Attempt to get token
        const tokenRequest = {
            scopes: ['https://graph.microsoft.com/.default'],
        };

        const response = await cca.acquireTokenByClientCredential(tokenRequest);

        if (response && response.accessToken) {
            console.log('✓ Successfully acquired access token');
            console.log(`✓ Token expires in: ${(response.expiresOn.getTime() - new Date().getTime()) / 1000} seconds`);
            return true;
        } else {
            console.error('❌ Failed to acquire access token');
            return false;
        }
    } catch (error) {
        console.error('❌ Error acquiring token:', error);
        return false;
    }
}

validateOAuthConfig()
    .then(success => {
        if (success) {
            console.log('✓ OAuth configuration is valid');
        } else {
            console.error('❌ OAuth configuration validation failed');
        }
        process.exit(success ? 0 : 1);
    });