/* Script for inline query functions. */

function answerInlineQuery(iq, data){
  // Answer inline query with suggested responses. https://core.telegram.org/bots/api#inline-mode
  var results = [];
  var query = iq.query;
  // TODO: Search results in spreadsheet  https://stackoverflow.com/questions/18482143/search-spreadsheet-by-column-return-rows
  // TODO: Send images  https://unnikked.ga/handling-multimedia-files-via-telegram-bots-api-abe3ed450c69
  // TODO: Send other result types  https://core.telegram.org/bots/api#inlinequeryresult
  // TODO: Considerar si viene iq.offset, enviar hasta 50 resultados, sino paginarlos
  results.push({
    'id': '1',
    'type': 'article',
    'title': 'Proporciones de tus platos',
    'description': 'Post de Instagram @lowcarbchileoficial',
    'url': 'https://www.instagram.com/p/B7UgQRCH0Hu/',
    'input_message_content': {
      'message_text': '[Post de @lowcarbchileoficial](https://www.instagram.com/p/B7UgQRCH0Hu/)',
      'parse_mode': 'Markdown'
    }
  });
  results.push({
    'id': '2',
    'type': 'article',
    'title': '¿Estás realmente hambriento?',
    'description': 'Post de Instagram @lowcarbchileoficial',
    'url': 'https://www.instagram.com/p/B7ZzM4sFZBx/',
    'input_message_content': {
      'message_text': '[Post de @lowcarbchileoficial](https://www.instagram.com/p/B7ZzM4sFZBx/)',
      'parse_mode': 'Markdown'
    }
  });
  // Save log and send results as responses
  saveLog('Inline Query', iq.query, data, 'Resultados:' + results.length);
  var reply = {
    'inline_query_id': iq.id,
    'results': results
  };
  // if (results.length > 50) reply.next_offset = '2';
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch(kety.telegram_url + 'answerInlineQuery', options);
}

