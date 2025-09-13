import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// POST /checkout endpoint
app.post('/checkout', async (req, res) => {
  try {
    const { productId, productName, price, name, email, address, phone } = req.body;

    console.log('Order received:', { productId, productName, price, name, email, address, phone });

    // Send to Google Sheets webhook
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL; // Set this env var
    if (googleSheetsUrl) {
      await fetch(googleSheetsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          price,
          name,
          email,
          address,
          phone,
        }),
      });
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

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Confirmation - Sticker MOM',
        text: `Thank you for your order!\n\nProduct: ${productName}\nPrice: ₹${price}\n\nShipping to: ${address}\n\nWe will process your order shortly.`,
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