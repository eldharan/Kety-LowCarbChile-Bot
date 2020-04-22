/* Script to store settings and keys. */

var kety = {};
kety.webapp_url = 'Your-WebApp-Url';

kety.telegram_token = 'Your-Telegram-Bot-Token';
kety.telegram_url = 'https://api.telegram.org/bot' + kety.telegram_token + '/';

kety.ss = SpreadsheetApp.openById('Your-Sheet-ID');
kety.codex = kety.ss.getSheetByName('Library');
kety.logs = kety.ss.getSheetByName('Logs');
