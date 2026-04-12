// ============================================================
// REVISE — Email Tracking Pixel via Google Apps Script
// ============================================================
//
// OPSÆTNING:
// 1. Gå til https://script.google.com
// 2. Opret nyt projekt → kald det "Revise Email Tracking"
// 3. Slet alt i Code.gs og indsæt koden nedenfor
// 4. Klik "Deploy" → "New deployment"
// 5. Type: "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Klik "Deploy" → kopier URL'en
// 9. Indsæt URL'en i din email som et usynligt billede (se bunden)
//
// ============================================================

function doGet(e) {
  var lead = e.parameter.lead || 'ukendt';
  var now = new Date().toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });

  // 1. Log til spreadsheet
  logOpen(lead, now);

  // 2. Send push-notifikation via ntfy
  notifyOpen(lead, now);

  // 3. Returner 1x1 transparent GIF
  var pixel = Utilities.base64Decode(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  );

  return ContentService
    .createOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function logOpen(lead, timestamp) {
  // Opret eller find spreadsheet
  var files = DriveApp.getFilesByName('Revise Email Tracking');
  var ss;

  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create('Revise Email Tracking');
    var sheet = ss.getActiveSheet();
    sheet.appendRow(['Tidspunkt', 'Lead', 'Antal åbninger']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }

  var sheet = ss.getActiveSheet();

  // Tjek om lead allerede har en række
  var data = sheet.getDataRange().getValues();
  var found = false;

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === lead) {
      // Opdater eksisterende
      var count = (data[i][2] || 0) + 1;
      sheet.getRange(i + 1, 1).setValue(timestamp);
      sheet.getRange(i + 1, 3).setValue(count);
      found = true;
      break;
    }
  }

  if (!found) {
    sheet.appendRow([timestamp, lead, 1]);
  }
}

function notifyOpen(lead, timestamp) {
  try {
    UrlFetchApp.fetch('https://ntfy.sh/revise-leads-dk', {
      method: 'post',
      headers: {
        'Title': lead + ' har aabnet din email',
        'Tags': 'email,eyes',
        'Priority': '3'
      },
      payload: lead + ' aabnet pitch-email.\nTidspunkt: ' + timestamp
    });
  } catch(e) {
    // Fail silently
  }
}


// ============================================================
// SÅDAN BRUGER DU DET I MAILEN:
// ============================================================
//
// Når du har deployed og fået din URL (ligner:
// https://script.google.com/macros/s/XXXXX/exec)
//
// Tilføj dette usynlige billede i bunden af din pitch-email:
//
// <img src="https://script.google.com/macros/s/XXXXX/exec?lead=El-Kontakten-Give"
//      width="1" height="1" style="display:block;opacity:0;" alt="">
//
// Skift ?lead=FIRMANAVN for hver ny pitch du sender.
//
// Resultater:
// - Push-notifikation via ntfy når de åbner
// - Google Sheet "Revise Email Tracking" logger alle åbninger
// - Tæller antal gange de åbner mailen
//
// VIGTIGT: Tracking pixels virker kun når modtageren loader
// billeder i mailen. Gmail loader normalt billeder automatisk,
// men nogle klienter blokerer dem.
// ============================================================
