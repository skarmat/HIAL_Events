// Configuration
const SPREADSHEET_ID = ""; // Add your spreadsheet ID here
const SHEET_NAME = "Registrations";

// Handle POST requests
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Get or create the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet
        .getRange("A1:N1")
        .setValues([
          [
            "Timestamp",
            "Name",
            "Profession",
            "Gender",
            "Medical Conditions",
            "Food Allergies",
            "Company",
            "Phone",
            "Email",
            "Address",
            "Participation Type",
            "Participant Count",
            "Group Participants",
            "Status",
          ],
        ]);
    }

    // Format the data for the sheet
    const timestamp = new Date().toLocaleString();
    const rowData = [
      timestamp,
      data.name,
      data.profession,
      data.gender,
      data.medical_conditions || "",
      data.food_allergies || "",
      data.company || "",
      data.phone,
      data.email,
      data.address,
      data.participation_type,
      data.participant_count,
      data.group_participants || "",
      "Pending",
    ];

    // Append the data
    sheet.appendRow(rowData);

    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
        message: "Data added successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput().setMimeType(
    ContentService.MimeType.TEXT
  );
}
