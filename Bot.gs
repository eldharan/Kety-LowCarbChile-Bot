/* Script for commands and responses. */

function doPost(obj){
  // Listener for post method of this Google WebApp and gateway for the Telegram bot, obj is the input request.
  if (obj.postData.type == 'application/json'){
    var data = JSON.parse(obj.postData.contents);
    if (data.hasOwnProperty('inline_query')){
      answerInlineQuery(data.inline_query, data);
    }
    else if (data.chat.type != 'supergroup'){
      var text = data.message.text;
      if (/^\/?start ?/gmi.test(text)){
        start(data)
        // TODO: Crear comando de preguntas
        // TODO: Responder memes - palmitos
        // TODO: Crear comando para guardar un artículo o post
        // TODO: Programar una tarea que haga fetch a los posts de IG oficial, IG de Josefina y Blog
      }
      else {
        unknownCommand(text, data);
      }
    }
  }
}

function saveLog(kind, text, data, extras){
  // Save a log entry in spreadsheet.
  var row = [new Date(), kind, text, data.message.chat.id, JSON.stringify(data), extras || ''];
  kety.logs.appendRow(row);
}

function unknownCommand(text, data){
  // Send unknown command default response.
  saveLog('Comando desconocido', text, data);
  var reply = {
    'chat_id': data.message.chat.id,
    'text': 'No entiendo lo que necesitas, puedes escribir una pregunta o usar /help para ver todos las opciones.',
    'parse_mode': 'Markdown',
    'disable_web_page_preview': true
  };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch(kety.telegram_url + 'sendMessage', options);
}

function start(data){
  // Send response to start message, data is the json contents. https://core.telegram.org/bots/api#sendmessage
  var reply = {
    'chat_id': data.message.chat.id,
    'text': '<b>Hola ' + data.message.chat.first_name + ' ' + data.message.chat.last_name + '</b>, ¿En que te puedo ayudar <i>hoy</i>?',
    'parse_mode': 'HTML',
    'disable_web_page_preview': true
  };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch(kety.telegram_url + 'sendMessage', options);
}
