import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Your Google Sheet ID
const RANGE = 'Orders!A:G'; // Sheet name and range

// Initialize Google Sheets API
async function getGoogleSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}');

  if (!credentials.client_email || !credentials.private_key) {
    console.warn('Google Sheets credentials not found. Make sure to set GOOGLE_CREDENTIALS_JSON environment variable.');
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

// POST /checkout endpoint
app.post('/checkout', async (req, res) => {
  try {
    const {
      cartItems,
      totalPrice,
      email,
      firstName,
      lastName,
      address,
      city,
      zipCode,
      country
    } = req.body;

    console.log('Order received:', {
      cartItems,
      totalPrice,
      email,
      firstName,
      lastName,
      address,
      city,
      zipCode,
      country
    });

    // Save to Google Sheets
    const sheets = await getGoogleSheetsClient();
    if (sheets && SPREADSHEET_ID) {
      const timestamp = new Date().toISOString();

      // Prepare order data for each cart item
      const orderData = cartItems.map((item, index) => [
        timestamp,
        `${firstName} ${lastName}`,
        email,
        item.product.name,
        item.quantity,
        `$${item.product.price}`,
        `$${totalPrice}`,
        `${address}, ${city}, ${zipCode}, ${country}`,
        index === 0 ? 'New Order' : '' // Status only for first row
      ]);

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        resource: {
          values: orderData,
        },
      });

      console.log('Order saved to Google Sheets successfully');
    } else {
      console.warn('Google Sheets not configured - order not saved to sheet');
    }

    // Send confirmation email (if configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const orderDetails = cartItems.map(item =>
        `${item.product.name} (x${item.quantity}) - $${item.product.price * item.quantity}`
      ).join('\n');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Confirmation - Sticker MOM',
        text: `Thank you for your order!\n\nOrder Details:\n${orderDetails}\n\nTotal: $${totalPrice}\n\nShipping to: ${firstName} ${lastName}\n${address}\n${city}, ${zipCode}\n${country}\n\nWe will process your order shortly.`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});