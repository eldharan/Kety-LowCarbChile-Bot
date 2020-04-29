/* WebApp basic functions and webhook initial configuration. doPost is on TelegramBot.gs */

function getMe(){
  // Connect our bot to Telegram bots API. https://core.telegram.org/bots/api#making-requests
  var response = UrlFetchApp.fetch(kety.telegram_url + 'getMe');
  console.log(response.getContentText());
}

function doGet(obj){
  // Listener for get method of this Google WebApp, obj is the input request.
  return HtmlService.createHtmlOutput('How you doin? ' + JSON.stringify(obj));
}

function setWebhook(){
  // Register this Google WebApp as our Telegram bot Webhook. https://core.telegram.org/bots/api#setwebhook
  var response = bot.sendResponse('setWebhook', {'url': kety.webapp_url});
  console.log(response.getContentText());
}

function deleteWebhook(){
  // Remove this Google WebApp as our Telegram bot Webhook. https://core.telegram.org/bots/api#deletewebhook
  var response = bot.sendResponse('deleteWebhook', {});
  console.log(response.getContentText());
}
