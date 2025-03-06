const sheetName = "Form Responses";
// ====================================================================
// IMPORTANT: Replace the empty string below with your Google Sheet ID
// To find your Sheet ID: Open your Google Sheet, look at the URL:
// https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
// Copy the YOUR_SHEET_ID_HERE part and paste it below
// ====================================================================
const spreadsheetId = "1Yx-Yx-YxYxYxYxYxYxYxYxYxYxYxYxYxYxYxYxY"; // Replace with your actual spreadsheet ID

function doPost(e) {
  // Validate if request exists
  if (!e || !e.postData) {
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        error: "No request data received",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Validate spreadsheet ID
  if (!spreadsheetId || spreadsheetId.trim() === "") {
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        error:
          "Spreadsheet ID is not configured. Please set the spreadsheetId variable in the script.",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Log incoming data for debugging
    Logger.log("Request received with postData: " + JSON.stringify(e.postData));

    // Check if contents exists
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({
          result: "error",
          error: "No data in request",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    Logger.log("Received data: " + e.postData.contents);

    const doc = SpreadsheetApp.openById(spreadsheetId);
    const sheet = doc.getSheetByName(sheetName) || doc.insertSheet(sheetName);

    const headers = [
      "Timestamp",
      "Name",
      "Profession",
      "Company",
      "Phone",
      "Email",
      "Address",
      "Participation Type",
      "Number of Participants",
      "Group Participants",
      "Participation Reason",
      "Photo URL",
      "Accommodation Type",
      "Transaction ID",
      "Payment Screenshot URL",
      "Total Amount",
    ];

    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log("Parsed data: " + JSON.stringify(data));
    } catch (parseError) {
      Logger.log("Error parsing JSON: " + parseError);
      return ContentService.createTextOutput(
        JSON.stringify({
          result: "error",
          error: "Invalid JSON data: " + parseError.toString(),
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const timestamp = new Date();

    const row = [
      timestamp,
      data.name || "",
      data.profession || "",
      data.company || "",
      data.phone || "",
      data.email || "",
      data.address || "",
      data.participation_type || "",
      data.participant_count || "1",
      data.group_participants || "",
      data.participation_reason || "",
      data.photo_url || "",
      data.accommodation_type || "",
      data.transaction_id || "",
      data.payment_screenshot_url || "",
      data.total_amount || "",
    ];

    sheet.appendRow(row);
    Logger.log("Data successfully appended to sheet");

    // Return success response with CORS headers
    const output = ContentService.createTextOutput(
      JSON.stringify({ result: "success", row: row })
    ).setMimeType(ContentService.MimeType.JSON);

    output.setHeader("Access-Control-Allow-Origin", "*");
    return output;
  } catch (error) {
    // Log the error for debugging
    Logger.log("Error in doPost: " + error);
    Logger.log("Stack: " + error.stack);

    // Return error response
    const output = ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        error: error.toString(),
        stack: error.stack,
      })
    ).setMimeType(ContentService.MimeType.JSON);

    output.setHeader("Access-Control-Allow-Origin", "*");
    return output;
  } finally {
    lock.releaseLock();
  }
}

// Handle preflight OPTIONS request for CORS
function doOptions(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  // Set CORS headers
  output.setHeader("Access-Control-Allow-Origin", "*");
  output.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  output.setHeader("Access-Control-Allow-Headers", "Content-Type");
  output.setHeader("Access-Control-Max-Age", "86400");

  return output;
}

function doGet(e) {
  // Add CORS headers to GET response
  var output = ContentService.createTextOutput(
    JSON.stringify({
      result: "success",
      method: "get",
      message:
        "The web app is running correctly. To submit data, use POST method.",
    })
  ).setMimeType(ContentService.MimeType.JSON);

  output.setHeader("Access-Control-Allow-Origin", "*");

  return output;
}
