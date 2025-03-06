const sheetName = "Form Responses";
const spreadsheetId = ""; // You'll add your spreadsheet ID here

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(spreadsheetId);
    const sheet = doc.getSheetByName(sheetName);

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

    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();

    const row = [
      timestamp,
      data.name,
      data.profession,
      data.company || "",
      data.phone,
      data.email,
      data.address,
      data.participation_type,
      data.participant_count || "1",
      data.group_participants || "",
      data.participation_reason,
      data.photo_url || "",
      data.accommodation_type,
      data.transaction_id,
      data.payment_screenshot_url || "",
      data.total_amount,
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ result: "success", method: "get" })
  ).setMimeType(ContentService.MimeType.JSON);
}
