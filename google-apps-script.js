// Google Apps Script code for handling checkout
// Deploy as web app and set the URL as GOOGLE_SHEETS_WEBHOOK_URL in backend

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { productId, productName, price, name, email, address, phone } = data;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    if (!sheet) {
      return ContentService
        .createTextOutput('Sheet "Orders" not found')
        .setMimeType(ContentService.MimeType.TEXT);
    }

    const timestamp = new Date().toISOString();
    sheet.appendRow([timestamp, productId, productName, price, name, email, address, phone || '']);

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput('Error')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}