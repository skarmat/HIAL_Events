const sheetName = "Form Responses";
const spreadsheetId = ""; // Add your spreadsheet ID here

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
      "Accommodation Type",
      "Transaction ID",
      "Total Amount",
    ];

    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Get form data from POST parameters
    const timestamp = new Date();
    const row = [
      timestamp,
      e.parameter.name,
      e.parameter.profession,
      e.parameter.company,
      e.parameter.phone,
      e.parameter.email,
      e.parameter.address,
      e.parameter.participation_type,
      e.parameter.participant_count,
      e.parameter.group_participants,
      e.parameter.participation_reason,
      e.parameter.accommodation_type,
      e.parameter.transaction_id,
      e.parameter.total_amount,
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", row: row })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error.toString() })
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
