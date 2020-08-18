/* Telegram Bot main script. */

function doPost(obj){
  // Listener for post method of this Google WebApp and gateway for the Telegram bot, obj is the input request.
  if (obj.postData.type == 'application/json'){
    var data = JSON.parse(obj.postData.contents);
    if (data.hasOwnProperty('inline_query')){
      bot.answerInlineQuery(data);
    }
    else if (data.message && data.message.chat && data.message.chat.type == 'private'){
      var text = data.message.text;
      if (/^\/?start ?/i.test(text)){
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
    /* else {
       bot.saveLog('Mensaje X', '', data);
    } */
  }
}

/* Generic multipurpose functions. */

var bot = {};

bot.escapeMarkdown = function(word){
  // Generic helper function to escape Markdown special characters.
  return word.replace(/_/g, '\\_').replace(/\*/g, '\\*').replace(/\[/g, '\\[').replace(/`/g, '\\`');
}

bot.saveLog = function(kind, text, data, extras){
  // Saves a log entry in the spreadsheet.
  var row = [new Date(), kind, text, data.message.chat.id, JSON.stringify(data), extras || ''];
  kety.logs.appendRow(row);
}

bot.sendResponse = function(method_name, reply_obj){
  // Generic function to send and return a response to Telegram Bot API, method_name is the method to be called and reply_obj is the object with parameters.
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply_obj),
    //'muteHttpExceptions': true,
  };
  var response = UrlFetchApp.fetch(kety.telegram_url + method_name, options);
  return response;
}

/* JSON file handlers for data source. */

bot.readLibrary = function(){
  // Read JSON library and save it in kety.links, this is faster than reading a spreadsheet.
  var json_file = DriveApp.getFileById(kety.json_file_id).getAs('application/json');
  kety.links = JSON.parse(json_file.getDataAsString());
}

bot.saveLibrary = function(){
  // Dump kety.links into JSON library, remember to normalize keywords.
  var json_file = DriveApp.getFileById(kety.json_file_id);
  json_file.setContent(JSON.stringify(kety.links));
}

/* Answer inline query results and processing. */

bot.serializedResult = function(tmp){
  // Function to convert the matched object into a serialized object for telegram response.
  var obj = {
    'id': tmp.id,
    'type': tmp.type,
    'title': tmp.title,
    'description': tmp.description,
  }
  if (tmp.type == 'article'){
    obj.url = tmp.url;
    obj.thumb_url = tmp.thumb_url;
    obj.input_message_content = {
      'message_text': bot.escapeMarkdown(tmp.title + '\n' + tmp.url),
      'parse_mode': 'Markdown',
    };
  }
  if (tmp.type == 'document'){
    obj.document_file_id = tmp.url;
    obj.caption = tmp.title;
    obj.parse_mode = 'Markdown';
  }
  if (tmp.type == 'photo'){
    if (tmp.source == 'telegram'){
      obj.photo_file_id = tmp.url;
      obj.caption = tmp.title;
      obj.parse_mode = 'Markdown';
      //obj.thumb_url = tmp.url;
    }
    if (tmp.source == 'web'){
      obj.photo_url = tmp.url;
      obj.thumb_url = tmp.thumb_url;
      obj.photo_width = tmp.photo_width;
      obj.photo_height = tmp.photo_photo_height;
    }
  }
  if (tmp.type == 'video'){
    obj.video_file_id = tmp.url;
    obj.caption = tmp.title;
    obj.parse_mode = 'Markdown';
    //obj.thumb_url = tmp.thumb_url;
  }
  return obj;
}

bot.answerInlineQuery = function(data){
  // Send serialized results with paginated suggested responses, up to 50 by page. Send first 10 links if query is empty. https://core.telegram.org/bots/api#inline-mode
  bot.readLibrary();
  var query = data.inline_query.query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  var results = [];
  var total_results = 0;
  var offset = '';
  var i = 0;
  if (query){
    if (data.inline_query.offset) i = parseInt(data.inline_query.offset);
    for (var total_links = kety.links.length; i < total_links; i++){
      if (kety.links[i].keywords.indexOf(query) != -1){
        total_results = results.push(bot.serializedResult(kety.links[i]));
        if (total_results == 50){
          offset = kety.links[i].id;
          break;
        }
      }
    }
  }
  else {
    for (; i < 10; i++) results.push(bot.serializedResult(kety.links[i]));
    total_results = 10;
  }
  var reply = {
    'inline_query_id': data.inline_query.id,
    'results': results,
  };
  if (offset) reply.next_offset = offset;
  if (data.inline_query.offset && !offset) reply.next_offset = '';
  kety.inlogs.appendRow([new Date(), data.inline_query.query, data.inline_query.from.id, total_results, offset, JSON.stringify(data)]);
  var response = bot.sendResponse('answerInlineQuery', reply);
}

function testInline(){
  // Function for testing bot.answerInlineQuery with demo data.
  var demo_data = {
    "update_id": 451102397,
    "inline_query": {
      "id": "3268278173010652046",
      "from": {
        "id": 760945310,
        "is_bot": false,
        "first_name": "Usuario",
        "last_name": "de pruebas",
        "username": "ketytest",
        "language_code": "es"
      },
      "query": "azúcar",
      "offset": "792"
    }
  };
  bot.answerInlineQuery(demo_data);
}

/* Commands and responses for private interactions. */

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
    var response = bot.sendResponse('sendMessage', reply);
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
  var response = bot.sendResponse('sendMessage', reply);
}

/*
function fixLibrary(){
  bot.readLibrary();
  var links = [];
  var skip = [115, 116, 117, 119, 121, 123, 124, 126, 127, 129, 136, 141, 142, 143, ];
  kety.links[122].title = 'LAS BAYAS SON FRUTAS BEBÉS';
  kety.links[125].title = 'Testimonio #35: Como plus, he bajado 22 kilos';
  kety.links[128].title = 'LA FIBRA NO ES ESENCIAL NI NECESARIA';
  kety.links[130].title = 'Cómo alcanzar una cetosis óptima';
  kety.links[131].title = 'Prueba por ti mismo';
  kety.links[132].title = '¿Qué es una alimentación baja en carbohidratos?';
  kety.links[134].title = '¿La grasa saturada me tapará las arterias y causará un infarto?';
  kety.links[135].title = '¿El cerebro necesita carbohidratos?';
  kety.links[137].title = 'Efecto Whoosh';
  kety.links[139].title = 'No tener nada en tu plato también es opción!';
  kety.links[140].title = 'Nuestras reglas de oro';
  
  kety.links[144].title = 'Ansiedad, como controlarla';
  kety.links[145].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  kety.links[146].title = '';
  for (var i = 0; i < kety.links.length; i++){
    if (!skip.includes(i)) links.push(kety.links[i]);
  }
  kety.links = links
  //kety.links.splice(26, 0, tmp);
  bot.saveLibrary();
}
*/
