# Sticker MOM - Google Sheets Integration

## Overview

This project includes Google Sheets integration to automatically store customer order data for easy contact management and order tracking.

## Features

- ✅ Automatic order data storage to Google Sheets
- ✅ Email confirmation system
- ✅ Complete customer information capture
- ✅ Order status tracking
- ✅ Real-time data updates

## Google Sheets Integration

### What Gets Stored

Each order creates a row in your Google Sheet with the following information:

| Column | Data | Example |
|--------|------|---------|
| Timestamp | Order date/time | 2024-01-15T10:30:00.000Z |
| Customer Name | Full name | John Doe |
| Email | Customer email | john@example.com |
| Product Name | Product ordered | Custom Sticker Pack |
| Quantity | Items ordered | 2 |
| Unit Price | Price per item | $15.99 |
| Total Price | Order total | $31.98 |
| Shipping Address | Full address | 123 Main St, City, 12345, Country |
| Status | Order status | New Order |

### Quick Setup

1. **Follow the setup guide**: See `GOOGLE_SHEETS_SETUP.md` for detailed instructions

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Test the connection**:
   ```bash
   npm run test-sheets
   ```

4. **Start the server**:
   ```bash
   npm run server
   ```

### Testing the Integration

1. **Test Google Sheets connection**:
   ```bash
   npm run test-sheets
   ```
   This will add a test row to your sheet.

2. **Test full order flow**:
   - Start the dev server: `npm run dev`
   - Start the backend: `npm run server`
   - Place a test order through the checkout form
   - Verify data appears in your Google Sheet

### Environment Variables Required

```bash
# Required for Google Sheets
SPREADSHEET_ID=your_google_sheet_id
GOOGLE_CREDENTIALS_JSON={...} # Your service account JSON

# Optional for email notifications
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Troubleshooting

**Connection Issues:**
- Run `npm run test-sheets` to diagnose problems
- Check your `.env` file formatting
- Verify service account permissions

**Data Not Appearing:**
- Check that your sheet has the correct name "Orders"
- Verify the SPREADSHEET_ID is correct
- Ensure headers are in row 1

**Email Not Working:**
- Use an app password for Gmail
- Check spam folder
- Verify EMAIL_USER and EMAIL_PASS

### Security Best Practices

- Never commit `.env` files to version control
- Use environment-specific spreadsheets
- Rotate service account keys regularly
- Limit service account permissions to specific sheets

### Support

For issues with Google Sheets integration:
1. Check the setup guide in `GOOGLE_SHEETS_SETUP.md`
2. Run the test script: `npm run test-sheets`
3. Verify your environment variables
4. Check Google Cloud Console for API enablement