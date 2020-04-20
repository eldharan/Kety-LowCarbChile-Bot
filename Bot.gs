/* Script for commands and responses. */

function doPost(obj){
  // Listener for post method of this Google WebApp and gateway for the Telegram bot, obj is the input request.
  if (obj.postData.type == 'application/json'){
    var data = JSON.parse(obj.postData.contents);
    var text = data.message.text;
    if (/^\/?start ?/gmi.test(text)){
      start(data)
    }
    else {
      Logger.log(text, data);
    }
  }
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
