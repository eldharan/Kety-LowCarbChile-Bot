/* Private configuration file for settings and keys. */

var kety = {};
kety.webapp_url = 'Your-WebApp-Url';

kety.telegram_token = 'Your-Telegram-Bot-Token';
kety.telegram_url = 'https://api.telegram.org/bot' + kety.telegram_token + '/';

kety.ss = SpreadsheetApp.openById('Your-Sheet-ID');
kety.logs = kety.ss.getSheetByName('Bot-Logs-Sheet-Name');
kety.inlogs = kety.ss.getSheetByName('Inline-Logs-Sheet-Name');

kety.json_file_id = 'Your-JSON-File-Drive-ID';
kety.links = [];

kety.chats = [
  {'name': 'fr', 'chat_id': 'Telegram-Chat-ID', 'open': false, 'fwd_msg': null},
  {'name': 'ayunadores', 'chat_id': '-100Telegram-Chat-ID', 'open': true, 'fwd_msg': null},
  {'name': 'novatos', 'chat_id': '-100Telegram-Chat-ID', 'open': true, 'fwd_msg': null},
  {'name': 'mayo1', 'chat_id': '-100Telegram-Chat-ID', 'open': true, 'fwd_msg': null},
  {'name': 'mayo2', 'chat_id': '-100Telegram-Chat-ID', 'open': true, 'fwd_msg': null},
  {'name': 'mayo3', 'chat_id': '-100Telegram-Chat-ID', 'open': true, 'fwd_msg': null},
]

