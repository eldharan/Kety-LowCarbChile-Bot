/* Maintenance and scheduled tasks. */

function novatosScheduler(){
  // Register triggers of novatos chat for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('blockPermissions').timeBased().everyDays(1).atHour(0).nearMinute(5).create();
  ScriptApp.newTrigger('activatePermissions').timeBased().everyDays(1).atHour(9).nearMinute(15).create();
}

var tasks = {};

tasks.changeGroupPermissions = function(activate){
  // Function to change Group Permissions using activate parameter.
  var msg = 'Chat cerrado, ¡a descansar! y nos leemos por la mañana.😎\n<b>Les dejo el instructivo básico para que no se olviden de leerlo.</b> 😘';
  if (activate) msg = '¡Buenos días ayunadores! 🙌\n<b>Ahora les dejo escribir normalmente en el chat.</b> 😘';
  var perms = {
    'chat_id': kety.chat_id.novatos,
    'permissions': {
      'can_send_messages': activate,
      'can_send_media_messages': activate,
      'can_send_polls': activate,
      'can_send_other_messages': activate,
      'can_add_web_page_previews': activate,
      'can_change_info': false,
      'can_invite_users': false,
      'can_pin_messages': false,
    }
  };
  var response = bot.sendResponse('setChatPermissions', perms);
  if (!activate){
    var reply = {
      'chat_id': kety.chat_id.novatos,
      'document': 'BQACAgEAAxkBAAIBDl6nXeoetP9_zIGan-trb9ihvg0xAAJIAQAC74ZBRX9dgxJs-sUEGQQ',
    };
    var response = bot.sendResponse('sendDocument', reply);
  }
  var reply = {
    'chat_id': kety.chat_id.novatos,
    'text': msg,
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = bot.sendResponse('sendMessage', reply);
}

function activatePermissions(){
  tasks.changeGroupPermissions(true);
}

function blockPermissions(){
  tasks.changeGroupPermissions(false);
}

function liveScheduler(){
  // Register triggers of live promotion for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('promoteJesuLive').timeBased().onMonthDay(30).atHour(18).nearMinute(15).create();
  ScriptApp.newTrigger('promoteJesuLive').timeBased().onMonthDay(30).atHour(20).nearMinute(30).create();
  ScriptApp.newTrigger('promoteJesuLive').timeBased().onMonthDay(30).atHour(22).nearMinute(0).create();
  ScriptApp.newTrigger('promoteJesuLive').timeBased().onMonthDay(31).atHour(11).nearMinute(0).create();
  ScriptApp.newTrigger('promoteJesuLive').timeBased().onMonthDay(31).atHour(12).nearMinute(30).create();
  ScriptApp.newTrigger('promoteJesuLive').timeBased().onMonthDay(31).atHour(14).nearMinute(0).create();
}
function promoteJesuLive(){
  // Send message to promote Jesu Instagram live
  var msg = 'Recuerden que mañana Domingo 31 a las 16 hrs nuestra amiga nutri Jesu hará un live en Instagram, ¡No se lo pierdan! 😘';
  var reply = {
    'chat_id': kety.chat_id.novatos,
    'text': msg,
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = bot.sendResponse('sendMessage', reply);
  var reply = {
    'chat_id': kety.chat_id.novatos,
    'video': 'BAACAgEAAxkBAAIBJF7SwolqzkstosLscG8aHq5cEofRAALOAANKIJlGtB1uHln9VqEZBA',
  };
  var response = bot.sendResponse('sendVideo', reply);
}
