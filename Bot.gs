/* Script for commands and responses. */

function doPost(obj){
  // Listener for post method of this Google WebApp and gateway for the Telegram bot, obj is the input request.
  console.log('Entrada: ', obj);
  if (obj.postData.type == 'application/json'){
    var data = JSON.parse(obj.postData.contents);
    if (data.hasOwnProperty('inline_query')){
      inline.answerInlineQuery(data.inline_query, data);
    }
    else {
      var text = data.message.text;
      if (/^\/?start ?/gmi.test(text)){
        bot.startMsg(data);
        // TODO: Crear comando de preguntas
        // TODO: Responder memes - palmitos
        // TODO: Porque te llamas Kety? R: Kety... de ¿qué te importa?
        // TODO: Crear comando para guardar un artículo o post
        // TODO: Programar una tarea que haga fetch a los posts de IG oficial, IG de Josefina y Blog
      }
      else {
        bot.unknownCommand(text, data);
      }
    }
  }
}

var bot = {};

bot.saveLog = function(kind, text, data, extras){
  // Save a log entry in spreadsheet.
  var row = [new Date(), kind, text, data.message.chat.id, JSON.stringify(data), extras || ''];
  kety.logs.appendRow(row);
}

bot.unknownCommand = function(text, data){
  // Send unknown command default response.
  saveLog('Comando desconocido', text, data);
  if (data.message.chat.type == 'private'){
    var reply = {
      'chat_id': data.message.chat.id,
      'text': 'No entiendo lo que necesitas, puedes escribir una pregunta o usar /help para ver todos las opciones.',
      'parse_mode': 'Markdown',
      'disable_web_page_preview': true,
    };
    var response = kety.sendResponse('sendMessage', reply);
  }
}

bot.startMsg = function(data){
  // Send response to start message, data is the json contents. https://core.telegram.org/bots/api#sendmessage
  var reply = {
    'chat_id': data.message.chat.id,
    'text': '<b>Hola ' + data.message.chat.first_name + ' ' + data.message.chat.last_name + '</b>, ¿En que te puedo ayudar hoy?',
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = kety.sendResponse('sendMessage', reply);
}
