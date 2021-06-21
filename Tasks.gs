/* Maintenance and scheduled tasks. */

function permissionScheduler(){
  // Register triggers to change permissions, based on time rules.
  ScriptApp.newTrigger('blockPermissions').timeBased().everyDays(1).atHour(22).nearMinute(15).create();
  ScriptApp.newTrigger('activatePermissions').timeBased().everyDays(1).atHour(8).nearMinute(20).create();
}

function repeaterScheduler(){
  // Register triggers to forward polls or other messages, based on time rules.
  ScriptApp.newTrigger('forwardMessagesRepeat').timeBased().everyDays(1).atHour(9).nearMinute(30).create();
  ScriptApp.newTrigger('forwardMessagesRepeat').timeBased().everyDays(1).atHour(12).nearMinute(30).create();
  ScriptApp.newTrigger('forwardMessagesRepeat').timeBased().everyDays(1).atHour(15).nearMinute(30).create();
  ScriptApp.newTrigger('forwardMessagesRepeat').timeBased().everyDays(1).atHour(18).nearMinute(30).create();
  ScriptApp.newTrigger('forwardMessagesRepeat').timeBased().everyDays(1).atHour(21).nearMinute(30).create();
}


var tasks = {};

tasks.changeGroupPermissions = function(activate){
  // Function to change Group Permissions using activate parameter.
  bot.readLibrary();
  for (var i = 0, total = kety.chats.length; i < total; i++){
    if (kety.chats[i].open){
      // Change permissions
      var perms = {
        'chat_id': kety.chats[i].chat_id,
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
      var msg = '<b>¡Buenos días! Ahora les dejo escribir normalmente en el chat.</b> 🙌😘';
      // Send document for closing
      if (!activate){
        msg = 'Chat cerrado, ¡a descansar! y nos leemos por la mañana.😎\n<b>Les dejo el instructivo básico para que no se olviden de leerlo.</b> 😘';
        var dcmt = {
          'chat_id': kety.chats[i].chat_id,
          'document': kety.links[0].url,
        };
        var response = bot.sendResponse('sendDocument', dcmt);
      }
      // Send message
      var reply = {
        'chat_id': kety.chats[i].chat_id,
        'text': msg,
        'parse_mode': 'HTML',
        'disable_web_page_preview': true,
      };
      var response = bot.sendResponse('sendMessage', reply);
    }
  }
}

tasks.forwardMessage = function(chat_index){
  // Function to reply a message from a specific chat
  var reply = {
    'chat_id': kety.chats[chat_index].chat_id,
    'from_chat_id': kety.chats[chat_index].chat_id,
    'message_id': kety.chats[chat_index].fwd_msg,
  };
  var response = bot.sendResponse('forwardMessage', reply);
}

function activatePermissions(){
  tasks.changeGroupPermissions(true);
}

function blockPermissions(){
  tasks.changeGroupPermissions(false);
}

function forwardMessagesRepeat(){
  for (var i = 0, total = kety.chats.length; i < total; i++){
    if (kety.chats[i].fwd_msg) tasks.forwardMessage(i);
  }
}

function promoteChangeHour(){
  // Send message to promote Jesu Instagram live
  var msg = 'Ahora ya no será necesario que nos envíen fotos de todos sus platos, pero nos tienen que demostrar que estudian y han aprendido a mejorar su salud. ¡Les haremos prueba! 👀😎';
  var reply = {
    'chat_id': kety.chats[1].chat_id,
    'text': msg,
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = bot.sendResponse('sendMessage', reply);
  /* var reply = {
    'chat_id': kety.chats[1].chat_id,
    'video': 'BAACAgEAAxkBAAIBJF7SwolqzkstosLscG8aHq5cEofRAALOAANKIJlGtB1uHln9VqEZBA',
  };
  var response = bot.sendResponse('sendVideo', reply); */
}
