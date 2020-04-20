/* Script for inline query functions. */

var inline = {};

inline.answerInlineQuery = function(iq, data){
  // Answer inline query with suggested responses. https://core.telegram.org/bots/api#inline-mode
  var results = [];
  console.log(iq, data);
  var query = iq.query;
  // TODO: Search results in spreadsheet  https://stackoverflow.com/questions/18482143/search-spreadsheet-by-column-return-rows
  // TODO: Send images  https://unnikked.ga/handling-multimedia-files-via-telegram-bots-api-abe3ed450c69
  // TODO: Send other result types  https://core.telegram.org/bots/api#inlinequeryresult
  // TODO: Considerar si viene iq.offset, enviar hasta 50 resultados, sino paginarlos
  results.push({
    'id': '1',
    'type': 'article',
    'title': 'Proporciones de tus platos',
    'description': 'IG post @lowcarbchileoficial',
    'url': 'https://www.instagram.com/p/B7UgQRCH0Hu/',
    'thumb_url': 'https://www.instagram.com/p/B7UgQRCH0Hu/media/?size=t',
    'input_message_content': {
      'message_text': 'Proporciones de tus platos\nhttps://www.instagram.com/p/B7UgQRCH0Hu/',
      'parse_mode': 'Markdown',
    },
  });
  results.push({
    'id': '2',
    'type': 'photo',
    'title': 'Proporciones de tus platos',
    'description': 'IG imagen @lowcarbchileoficial',
    'photo_url': 'https://www.instagram.com/p/B7UgQRCH0Hu/media/?size=l',
    'thumb_url': 'https://www.instagram.com/p/B7UgQRCH0Hu/media/?size=t',
  });
  results.push({
    'id': '3',
    'type': 'article',
    'title': '¿Estás realmente hambriento?',
    'description': 'IG post @lowcarbchileoficial',
    'url': 'https://www.instagram.com/p/B7ZzM4sFZBx/',
    'thumb_url': 'https://www.instagram.com/p/B7ZzM4sFZBx/media/?size=t',
    'input_message_content': {
      'message_text': '¿Estás realmente hambriento?\nhttps://www.instagram.com/p/B7ZzM4sFZBx/',
      'parse_mode': 'Markdown',
    },
  });
  results.push({
    'id': '4',
    'type': 'photo',
    'title': '¿Estás realmente hambriento?',
    'description': 'IG imagen @lowcarbchileoficial',
    'photo_url': 'https://www.instagram.com/p/B7ZzM4sFZBx/media/?size=l',
    'thumb_url': 'https://www.instagram.com/p/B7ZzM4sFZBx/media/?size=t',
  });
  // Save log and send results as responses
  // saveLog('Inline Query', iq.query, data, 'Resultados:' + results.length);
  var reply = {
    'inline_query_id': iq.id,
    'results': results
  };
  // if (results.length > 50) reply.next_offset = '2';
  var response = kety.sendResponse('answerInlineQuery', reply);
}
