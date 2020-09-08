/* Private configuration file for settings and keys. */

var kety = {};
kety.webapp_url = 'Your-WebApp-Url';

kety.telegram_token = 'Your-Telegram-Bot-Token';
kety.telegram_url = 'https://api.telegram.org/bot' + kety.telegram_token + '/';

kety.chat_id = {};
kety.chat_id.novatos = '-Novatos-Group-Chat-ID';
kety.chat_id.primer = '-First-Month-Group-Chat-ID';
kety.chat_id.fr = 'User-Chat-ID';

kety.ss = SpreadsheetApp.openById('Your-Sheet-ID');
kety.logs = kety.ss.getSheetByName('Bot-Logs-Sheet-Name');
kety.inlogs = kety.ss.getSheetByName('Inline-Logs-Sheet-Name');

kety.json_file_id = 'Your-JSON-File-Drive-ID';
kety.links = [];

kety.fwd_msg = {}
kety.fwd_msg.novatos = 99999;
kety.fwd_msg.primer = null;

