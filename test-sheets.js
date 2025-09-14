import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = 'Orders!A:I';

// Test Google Sheets connection
async function testGoogleSheetsConnection() {
  try {
    console.log('Testing Google Sheets connection...');

    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || '{}');

    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('Google credentials not found. Please check your .env file.');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test by reading the sheet headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Orders!A1:I1',
    });

    console.log('✅ Google Sheets connection successful!');
    console.log('Sheet headers:', response.data.values?.[0] || 'No headers found');

    // Test writing a sample row
    const testData = [
      new Date().toISOString(),
      'Test Customer',
      'test@example.com',
      'Test Product',
      '1',
      '$10.00',
      '$10.00',
      '123 Test St, Test City, 12345, Test Country',
      'Test Order'
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      resource: {
        values: [testData],
      },
    });

    console.log('✅ Test data written to Google Sheets successfully!');
    console.log('Check your Google Sheet to verify the test entry.');

  } catch (error) {
    console.error('❌ Google Sheets connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your SPREADSHEET_ID in .env');
    console.log('2. Verify GOOGLE_CREDENTIALS_JSON is properly formatted');
    console.log('3. Ensure the service account has edit access to the sheet');
    console.log('4. Check that the "Orders" sheet exists in your spreadsheet');
  }
}

testGoogleSheetsConnection();