# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Sticker MOM Orders"
4. Create a sheet named "Orders"
5. Add the following headers in row 1:

```
A1: Timestamp
B1: Customer Name
C1: Email
D1: Product Name
E1: Quantity
F1: Unit Price
G1: Total Price
H1: Shipping Address
I1: Status
```

## Step 2: Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in:
   - Service account name: `sticker-mom-orders`
   - Service account ID: `sticker-mom-orders`
   - Description: `Service account for Sticker MOM order management`
4. Click "Create and Continue"
5. Skip the optional steps, click "Done"

## Step 4: Generate Service Account Key

1. Find your service account in the credentials list
2. Click on it, then go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file - this contains your credentials

## Step 5: Share Google Sheet with Service Account

1. Go back to your Google Sheet
2. Click "Share" button
3. Paste the `client_email` from your JSON file
4. Give it "Editor" permissions
5. Click "Share"

## Step 6: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in the values:

```bash
# Copy the entire JSON content from your service account key file
GOOGLE_CREDENTIALS_JSON={...}

# Get the spreadsheet ID from the URL of your Google Sheet
# URL format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
SPREADSHEET_ID=your_spreadsheet_id_here
```

## Step 7: Test the Integration

1. Start your server: `npm run server` (you may need to add this script)
2. Submit a test order through your checkout form
3. Check your Google Sheet - the order should appear automatically

## Troubleshooting

- **403 Forbidden**: Make sure the service account has edit access to the sheet
- **Invalid Credentials**: Double-check your JSON credentials format
- **Sheet not found**: Verify the SPREADSHEET_ID is correct

## Security Notes

- Never commit the `.env` file to version control
- Keep your service account key secure
- Regularly rotate service account keys
- Consider using environment-specific sheets (dev/staging/prod)