// src/services/microsoft-sender.js
import { createTransport } from 'nodemailer';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { NotificationService } from 'medusa-interfaces';

class MicrosoftSenderService extends NotificationService {
    constructor({ }, options) {
        super();

        this.options = options;

        // MSAL configuration
        this.msalConfig = {
            auth: {
                clientId: options.client_id,
                clientSecret: options.client_secret,
                authority: `https://login.microsoftonline.com/${options.tenant_id}`
            }
        };

        this.msalClient = new ConfidentialClientApplication(this.msalConfig);
        this.transporter = null;
    }

    async getAccessToken() {
        try {
            const result = await this.msalClient.acquireTokenByClientCredential({
                scopes: ['https://outlook.office365.com/.default']
            });
            return result.accessToken;
        } catch (error) {
            console.error('Failed to get access token:', error);
            throw error;
        }
    }

    async initializeTransporter() {
        const accessToken = await this.getAccessToken();

        this.transporter = createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: this.options.sender_email,
                clientId: this.options.client_id,
                clientSecret: this.options.client_secret,
                tenantId: this.options.tenant_id,
                accessToken
            }
        });
    }

    async sendNotification(event, data, attachmentGenerator) {
        try {
            if (!this.transporter) {
                await this.initializeTransporter();
            }

            // Handle different event types
            let emailData;
            switch (event) {
                case "order.placed":
                    emailData = this.getOrderPlacedData(data);
                    break;
                case "order.shipped":
                    emailData = this.getOrderShippedData(data);
                    break;
                case "customer.password_reset":
                    emailData = this.getPasswordResetData(data);
                    break;
                default:
                    throw new Error(`Unsupported event type: ${event}`);
            }

            const { to, subject, html } = emailData;

            await this.transporter.sendMail({
                from: this.options.sender_email,
                to,
                subject,
                html
            });

        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }

    getOrderPlacedData(data) {
        return {
            to: data.email,
            subject: 'Order Confirmation',
            html: `
        <h1>Order Confirmed</h1>
        <p>Thank you for your order!</p>
        <p>Order ID: ${data.id}</p>
        <p>Total: ${data.total}</p>
      `
        };
    }

    getOrderShippedData(data) {
        return {
            to: data.email,
            subject: 'Order Shipped',
            html: `
        <h1>Your Order Has Been Shipped</h1>
        <p>Order ID: ${data.id}</p>
        <p>Tracking Number: ${data.tracking_number}</p>
      `
        };
    }

    getPasswordResetData(data) {
        return {
            to: data.email,
            subject: 'Password Reset',
            html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${data.reset_link}">Reset Password</a>
      `
        };
    }
}

export default MicrosoftSenderService;