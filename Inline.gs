/* Script for inline query and search interactions. */

var inline = {};

inline.serializedObject = function(headers, row_index){
  // Function to convert the matched row into an object and return a serialized object for response.
  var row = kety.codex.getRange(row_index, 1, row_index, 10).getValues()[0];
  var tmp = {};
  for (var i = 0; i < headers.length; i++) tmp[headers[i]] = row[i];
  var obj = {
    'id': ''+tmp.id,
    'type': tmp.type,
    'title': tmp.title,
    'description': tmp.description,
  }
  if (tmp.type == 'article'){
    obj.url = tmp.url;
    obj.thumb_url = tmp.thumb_url;
    obj.input_message_content = {
      'message_text': tmp.title + (tmp.source == 'text' ? '\n\n' : '\n') + kety.escapeMarkdown(tmp.url),
      'parse_mode': 'Markdown',
    };
  }
  if (tmp.type == 'document'){
    obj.document_file_id = tmp.file_id;
    obj.caption = tmp.title;
    obj.parse_mode = 'Markdown';
  }
  if (tmp.type == 'photo'){
    if (tmp.source == 'telegram'){
      obj.photo_file_id = tmp.file_id;
      obj.caption = tmp.title;
      obj.parse_mode = 'Markdown';
    }
    if (tmp.source == 'web'){
      obj.photo_url = tmp.url;
      obj.thumb_url = tmp.thumb_url;
      obj.photo_width = parseInt(tmp.photo_width);
      obj.photo_height = parseInt(tmp.photo_photo_height);
    }
  }
  return obj;
}

inline.answerInlineQuery = function(data){
  // Answer inline query results with paginated suggested responses, up to 50 by page. Send most common links if query is empty. https://core.telegram.org/bots/api#inline-mode
  var headers = kety.codex.getDataRange().offset(0, 0, 1).getValues()[0];
  var results = [];
  var query = data.inline_query.query.trim().toLowerCase();
  var index = 0; // Finish as total matches.
  var offset = 0; // Page number starting from 0.
  if (query){
    var search = kety.codex.getRange(2, 11, kety.codex.getLastRow(), 11).createTextFinder(query).matchCase(false).ignoreDiacritics(true);
    var match = search.findNext();
    if (data.inline_query.offset){
      offset = parseInt(data.inline_query.offset);
      for (index = 0; index < 50*offset; index++) match = search.findNext();
    }
    while (match){
      if (results.length < 50) results.push(inline.serializedObject(headers, match.getRowIndex()));
      match = search.findNext();
      index++;
    }
  }
  else {
    results = inline.exampleResponseTypes();
  }
  var reply = {
    'inline_query_id': data.inline_query.id,
    'results': results,
  };
  if (index > 50 && !offset) reply.next_offset = '1';
  if (offset) reply.next_offset = (index - 50*offset) > 0 ? ''+(++offset) : '';
  // Save log and send results as responses.
  var row = [new Date(), 'Inline Query', query, '', JSON.stringify(data), 'Resultados: ' + results.length + ', Page: ' + data.inline_query.offset];
  kety.logs.appendRow(row);
  var response = kety.sendResponse('answerInlineQuery', reply);
}

inline.exampleResponseTypes = function(){
  // Example of use of different types of InlineQueryResult objects. https://core.telegram.org/bots/api#inlinequeryresultf
  var results = [];
  // InlineQueryResultCachedDocument, Documento de Telegram con el file_id.
  results.push({
    'type': 'document',
    'title': 'Instrucciones para novatos en Low Carb Chile',
    'description': 'Documento de Telegram',
    'document_file_id': 'BQACAgEAAxkBAAO6XqEOEN6oOvDToTYi1yDkhfNXr_cAApQAA4OeCUWuPO1I4rSwzhgE',
    'caption': 'Instrucciones para novatos en Low Carb Chile',
    'parse_mode': 'Markdown',
    'id': '1',
  });
  // InlineQueryResultArticle, Post de Instagram, responde texto formateado con link y carga vista previa, requiere hacer prefetch del thumbnail: https://www.instagram.com/p/B7UgQRCH0Hu/media/?size=t
  results.push({
    'type': 'article',
    'title': 'Proporciones de tus platos',
    'description': 'IG post @lowcarbchileoficial',
    'url': 'https://www.instagram.com/p/B7UgQRCH0Hu/',
    'thumb_url': 'https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e35/s150x150/81908314_1747571405367386_5259296594522926485_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=CNXVvETCXLEAX-E8N6g&oh=ab502f7109ead53b6c934df1015afc9f&oe=5ECB4AE1',
    'input_message_content': {
      'message_text': 'Proporciones de tus platos\n' + kety.escapeMarkdown('https://www.instagram.com/p/B7UgQRCH0Hu/'),
      'parse_mode': 'Markdown',
    },
    'id': '2',
  });
  // InlineQueryResultArticle, Post de Instagram, responde texto formateado con link y carga vista previa, requiere hacer prefetch del thumbnail: https://www.instagram.com/p/B7ZzM4sFZBx/media/?size=t
  results.push({
    'type': 'article',
    'title': '¿Estás realmente hambriento?',
    'description': 'IG post @lowcarbchileoficial',
    'url': 'https://www.instagram.com/p/B7ZzM4sFZBx/',
    'thumb_url': 'https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e35/s150x150/81659841_104268377705666_83704157537628844_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=GNqlEmzrOjYAX-xm1bp&oh=9f9742a90c8642f13a7032df15661bea&oe=5ECAED37',
    'input_message_content': {
      'message_text': '¿Estás realmente hambriento?\n' + kety.escapeMarkdown('https://www.instagram.com/p/B7ZzM4sFZBx/'),
      'parse_mode': 'Markdown',
    },
    'id': '3',
  });
  // InlineQueryResultArticle, Artículo de la web, requiere url del thumbnail.
  results.push({
    'type': 'article',
    'title': 'Keto breve y fácil',
    'description': 'Entrada de web lowcarbchile.com',
    'url': 'https://www.lowcarbchile.com/2019/10/18/keto-breve-y-facil/',
    'thumb_url': 'https://www.lowcarbchile.com/wp-content/uploads/2019/10/Bacon.jpg',
    'input_message_content': {
      'message_text': 'Keto breve y fácil\n' + kety.escapeMarkdown('https://www.lowcarbchile.com/2019/10/18/keto-breve-y-facil/'),
      'parse_mode': 'Markdown',
    },
    'id': '4',
  });
  // InlineQueryResultArticle, Video de Youtube como artículo, la url del thumbnail se obtiene de la vista previa de la lista.
  results.push({
    'type': 'article',
    'title': 'YouTube: Jugando a leer etiquetas',
    'description': 'Lista en Youtube LowCarbChile',
    'url': 'https://www.youtube.com/playlist?list=PLXw1NNwYyeI1nYvP-y_9sjaSAaVNi0Xgp',
    'thumb_url': 'https://i.ytimg.com/vi/pXh_MbppROk/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAlpHuq0Sq8AgXWUbmHeDqjR1sHBQ',
    'input_message_content': {
      'message_text': 'YouTube: Jugando a leer etiquetas\n' + kety.escapeMarkdown('https://www.youtube.com/playlist?list=PLXw1NNwYyeI1nYvP-y_9sjaSAaVNi0Xgp'),
      'parse_mode': 'Markdown',
    },
    'id': '5',
  });
  // InlineQueryResultArticle, Artículo de la web, requiere url del thumbnail.
  results.push({
    'type': 'article',
    'title': 'La guía definitiva de la dieta Keto para principiantes',
    'description': 'Entrada de web lowcarbchile.com',
    'url': 'https://www.lowcarbchile.com/2020/03/16/la-guia-definitiva-de-la-dieta-keto-para-principiantes/',
    'thumb_url': 'https://www.lowcarbchile.com/wp-content/uploads/2020/03/maxresdefault.jpg',
    'input_message_content': {
      'message_text': 'La guía definitiva de la dieta Keto para principiantes\n' + kety.escapeMarkdown('https://www.lowcarbchile.com/2020/03/16/la-guia-definitiva-de-la-dieta-keto-para-principiantes/'),
      'parse_mode': 'Markdown',
    },
    'id': '6',
  });
  // InlineQueryResultArticle, Post de Instagram, responde texto formateado con link y carga vista previa, requiere hacer prefetch del thumbnail: https://www.instagram.com/p/B87y0DZgmXa/media/?size=t
  results.push({
    'type': 'article',
    'title': 'Magnesio, mineral mágico',
    'description': 'IG post @josefinavaraslau',
    'url': 'https://www.instagram.com/p/B87y0DZgmXa/',
    'thumb_url': 'https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e15/s150x150/84430613_576035803253616_3757916344712551658_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=dGp8RU_PigcAX_zi9pk&oh=a48628ddd09ee18e33e269572029c912&oe=5ECC4ABF',
    'input_message_content': {
      'message_text': 'Magnesio, mineral mágico\n' + kety.escapeMarkdown('https://www.instagram.com/p/B87y0DZgmXa/'),
      'parse_mode': 'Markdown',
    },
    'id': '7',
  });
  // InlineQueryResultArticle, Artículo de la web, requiere url del thumbnail.
  results.push({
    'type': 'article',
    'title': 'Todo sobre el omega 3',
    'description': 'Entrada de web lowcarbchile.com',
    'url': 'https://www.lowcarbchile.com/2020/02/10/todo-sobre-el-omega-3/',
    'thumb_url': 'https://www.lowcarbchile.com/wp-content/uploads/2020/02/omega-3-scaled.jpeg',
    'input_message_content': {
      'message_text': 'Todo sobre el omega 3\n' + kety.escapeMarkdown('https://www.lowcarbchile.com/2020/02/10/todo-sobre-el-omega-3/'),
      'parse_mode': 'Markdown',
    },
    'id': '8',
  });
  // InlineQueryResultArticle, Video de Youtube como artículo, para la url del thumbnail solo se inserta la ID del video.
  results.push({
    'type': 'article',
    'title': 'Dr. Cywes: La fibra no es esencial ni necesaria',
    'description': 'Video en Youtube de Carb Addiction Doc',
    'url': 'https://www.youtube.com/watch?v=FBgxX2nsY4A',
    'thumb_url': 'https://img.youtube.com/vi/FBgxX2nsY4A/maxresdefault.jpg',
    'input_message_content': {
      'message_text': 'Dr. Cywes: La fibra no es esencial ni necesaria\n' + kety.escapeMarkdown('https://www.youtube.com/watch?v=FBgxX2nsY4A'),
      'parse_mode': 'Markdown',
    },
    'id': '9',
  });
  // InlineQueryResultArticle, Post de Instagram TV, requiere hacer prefetch del thumbnail cambiando tv por p: https://www.instagram.com/p/B-w_F-RnGkh/media/?size=t
  results.push({
    'type': 'article',
    'title': 'Carboadictos',
    'description': 'IGTV post @lowcarbchileoficial',
    'url': 'https://www.instagram.com/tv/B-w_F-RnGkh/',
    'thumb_url': 'https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.248.639.639a/s150x150/93395039_1864730713660473_4787310026239585650_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=tHqdWX4ncX0AX_tZghc&oh=bea5cfb0c4f7dda5e18322f320638168&oe=5EA32091',
    'input_message_content': {
      'message_text': 'Carboadictos\n' + kety.escapeMarkdown('https://www.instagram.com/tv/B-w_F-RnGkh/'),
      'parse_mode': 'Markdown',
    },
    'id': '10',
  });
  /* InlineQueryResultPhoto, Imagen de la web, width y height son obligatorios.
  results.push({
    'type': 'photo',
    'title': 'Tazones',
    'description': 'Imagen de web lowcarbchile.com',
    'photo_url': 'https://www.lowcarbchile.com/wp-content/uploads/2020/04/photo_2020-04-10_14-42-51.jpg',
    'thumb_url': 'https://www.lowcarbchile.com/wp-content/uploads/2020/04/photo_2020-04-10_14-42-51.jpg',
    'photo_width': 960,
    'photo_height': 540,
    'id': '11',
  }); */
  /* InlineQueryResultCachedPhoto, Imagen de Telegram con el file_id, en el cliente de escritorio no permite seleccionar las imágenes.
  results.push({
    'type': 'photo',
    'title': 'Proporciones de tus platos',
    'description': 'Imagen de Telegram',
    'photo_file_id': 'AgACAgEAAxkBAAOYXqDcllgPDTSIwj3hQt6F8djaLKQAAg-pMRvQwghFyyC3WBmG1YdU4GsGAAQBAAMCAAN5AAP2hAMAARgE',
    'caption': 'Proporciones de tus platos',
    'parse_mode': 'Markdown',
    'id': '12',
  }); */
  /* InlineQueryResultPhoto, Imagen de Instagram, responde la imagen, requiere hacer prefetch del thumbnail e imagen completa: https://www.instagram.com/p/B7ZzM4sFZBx/media/?size=l
  results.push({
    'type': 'photo',
    'title': '¿Estás realmente hambriento?',
    'description': 'IG imagen @lowcarbchileoficial',
    'photo_url': 'https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e35/81659841_104268377705666_83704157537628844_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=GNqlEmzrOjYAX-xm1bp&oh=4e2bae8fb99ed296f9ee01bf48d33f7d&oe=5ECA8C34',
    'thumb_url': 'https://instagram.fscl14-1.fna.fbcdn.net/v/t51.2885-15/e35/s150x150/81659841_104268377705666_83704157537628844_n.jpg?_nc_ht=instagram.fscl14-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=GNqlEmzrOjYAX-xm1bp&oh=9f9742a90c8642f13a7032df15661bea&oe=5ECAED37',
    'photo_width': 1080,
    'photo_height': 1080,
    'id': '-3',
  }); */
  return results;
}

/* Testing functions. */

function testInlineQuery(){
  // Simple debugger function with dummy data.
  var demo_data = {
    "update_id": 451102397,
    "inline_query": {
      "id": "3268278172226261514",
      "from": {
        "id": 760945310,
        "is_bot": false,
        "first_name": "Usuario",
        "last_name": "de pruebas",
        "username": "ketytest",
        "language_code": "es"
      },
      "query": "magnesio",
      "offset": ""
    }
  };
  inline.answerInlineQuery(demo_data);  
}
