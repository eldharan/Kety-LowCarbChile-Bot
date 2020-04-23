/* Script for scheduled and maintenance tasks. */

function taskScheduler(){
  // Register triggers for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('blockPermissions').timeBased().everyDays(1).atHour(0).nearMinute(5).create();
  ScriptApp.newTrigger('activatePermissions').timeBased().everyDays(1).atHour(9).nearMinute(15).create();
}

var tasks = {};

tasks.changeGroupPermissions = function(activate){
  // Function to change Group Permissions using activate parameter.
  var msg = 'Chat cerrado, ¡a descansar! y nos leemos por la mañana.😎\n<b>Les dejo el instructivo básico para que no se olviden de leerlo.</b> 😘';
  if (activate) msg = '¡Buenos días ayunadores! 🙌\n<b>Ahora les dejo escribir normalmente en el chat.</b> 😘';
  var perms = {
    'chat_id': kety.novatos_chat_id,
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
  var response = kety.sendResponse('setChatPermissions', perms);
  if (!activate){
    var reply = {
      'chat_id': kety.novatos_chat_id,
      'document': 'BQACAgEAAxkBAAO6XqEOEN6oOvDToTYi1yDkhfNXr_cAApQAA4OeCUWuPO1I4rSwzhgE',
    };
    var response = kety.sendResponse('sendDocument', reply);
  }
  var reply = {
    'chat_id': kety.novatos_chat_id,
    'text': msg,
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = kety.sendResponse('sendMessage', reply);
}

function activatePermissions(){
  tasks.changeGroupPermissions(true);
}

function blockPermissions(){
  tasks.changeGroupPermissions(false);
}
