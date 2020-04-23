/* Script for commands and responses of private interactions. */

function doPost(obj){
  // Listener for post method of this Google WebApp and gateway for the Telegram bot, obj is the input request.
  if (obj.postData.type == 'application/json'){
    var data = JSON.parse(obj.postData.contents);
    if (data.hasOwnProperty('inline_query')){
      inline.answerInlineQuery(data);
    }
    else if (data.message && data.message.chat && data.message.chat.type == 'private'){
      var text = data.message.text;
      if (/^\/?start ?/gmi.test(text)){
        bot.startMsg(data);
        // TODO: Crear comando de preguntas básicas o sugerencias, ej: "Porque te llamas Kety? R: Kety... de ¿qué te importa?", "Puedo consumir sal? cuánta?"
        // TODO: Responder memes como imágenes: palmitos, falmitof, te he fallado, longas, donación
        // TODO: Crear comando para guardar un artículo o post con la info necesaria
        // TODO: Crear comando para leer los datos de una entrada y botones para modificarla
        // TODO: Programar una tarea que haga fetch a los posts de IG oficial, IG de Josefina, Blog, Youtube
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
  bot.saveLog('Comando desconocido', text, data);
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
  bot.saveLog('Mensaje privado de inicio', data.message.text, data);
  var reply = {
    'chat_id': data.message.chat.id,
    'text': 'Hola <b>' + data.message.chat.first_name + ' ' + data.message.chat.last_name + '</b>, ¿En que te puedo ayudar hoy?',
    'parse_mode': 'HTML',
    'disable_web_page_preview': true,
  };
  var response = kety.sendResponse('sendMessage', reply);
}
