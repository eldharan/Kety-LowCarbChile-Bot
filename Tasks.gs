/* Maintenance and scheduled tasks. */

function novatosScheduler(){
  // Register triggers of novatos chat for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('blockPermissions').timeBased().everyDays(1).atHour(22).nearMinute(5).create();
  ScriptApp.newTrigger('activatePermissions').timeBased().everyDays(1).atHour(8).nearMinute(50).create();
}

var tasks = {};

tasks.changeGroupPermissions = function(activate){
  // Function to change Group Permissions using activate parameter.
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
  perms.chat_id = kety.chat_id.primer;
  var response = bot.sendResponse('setChatPermissions', perms);
  if (!activate){
    bot.readLibrary();
    var dcmnt = {
      'chat_id': kety.chat_id.novatos,
      'document': kety.links[0].url,
    };
    var response = bot.sendResponse('sendDocument', dcmnt);
    dcmnt.chat_id = kety.chat_id.primer;
    var response = bot.sendResponse('sendDocument', dcmnt);
  }
  var msg = 'Chat cerrado, ¡a descansar! y nos leemos por la mañana.😎\n<b>Les dejo el instructivo básico para que no se olviden de leerlo.</b> 😘';
  if (activate) msg = '¡Buenos días ayunadores! 🙌\n<b>Ahora les dejo escribir normalmente en el chat.</b> 😘';
  var reply = {
    'chat_id': kety.chat_id.novatos,
    'text': msg,
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = bot.sendResponse('sendMessage', reply);
  reply.chat_id = kety.chat_id.primer;
  var response = bot.sendResponse('sendMessage', reply);
}

function activatePermissions(){
  tasks.changeGroupPermissions(true);
}

function blockPermissions(){
  tasks.changeGroupPermissions(false);
}

function pollScheduler(){
  // Register triggers of forward poll promotion for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('fwdPoll').timeBased().everyDays(1).atHour(9).nearMinute(30).create();
  ScriptApp.newTrigger('fwdPoll').timeBased().everyDays(1).atHour(12).nearMinute(30).create();
  ScriptApp.newTrigger('fwdPoll').timeBased().everyDays(1).atHour(15).nearMinute(30).create();
  ScriptApp.newTrigger('fwdPoll').timeBased().everyDays(1).atHour(18).nearMinute(30).create();
  ScriptApp.newTrigger('fwdPoll').timeBased().everyDays(1).atHour(21).nearMinute(30).create();
  /*ScriptApp.newTrigger('promoteChangeHour').timeBased().onMonthDay(4).atHour(12).nearMinute(30).create();
  ScriptApp.newTrigger('promoteChangeHour').timeBased().onMonthDay(4).atHour(15).nearMinute(0).create();
  ScriptApp.newTrigger('promoteChangeHour').timeBased().onMonthDay(4).atHour(17).nearMinute(30).create();
  ScriptApp.newTrigger('promoteChangeHour').timeBased().onMonthDay(4).atHour(20).nearMinute(0).create();*/
}
function promoteChangeHour(){
  // Send message to promote Jesu Instagram live
  var msg = 'Ahora ya no será necesario que nos envíen fotos de todos sus platos, pero nos tienen que demostrar que estudian y han aprendido a mejorar su salud. ¡Les haremos prueba! 👀😎';
  var reply = {
    'chat_id': kety.chat_id.novatos,
    'text': msg,
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = bot.sendResponse('sendMessage', reply);
  /* var reply = {
    'chat_id': kety.chat_id.novatos,
    'video': 'BAACAgEAAxkBAAIBJF7SwolqzkstosLscG8aHq5cEofRAALOAANKIJlGtB1uHln9VqEZBA',
  };
  var response = bot.sendResponse('sendVideo', reply); */
}
function fwdPoll(){
  var reply = {
    'chat_id': kety.chat_id.novatos,
    'from_chat_id': kety.chat_id.novatos,
    'message_id': 102459,
  };
  var response = bot.sendResponse('forwardMessage', reply);
}

