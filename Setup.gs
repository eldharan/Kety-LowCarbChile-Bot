/* Script for basic initial configuration and setup Webhook. */

function getMe(){
  // Connect our bot to Telegram bots API. https://core.telegram.org/bots/api#making-requests
  var url = kety.telegram_url + 'getMe';
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(obj){
  // Listener for get method of this Google WebApp, obj is the input request.
  return HtmlService.createHtmlOutput('How you doin? ' + JSON.stringify(obj));
}

kety.sendResponse = function(method_name, reply_obj){
  // Send and return a response to Telegram Bot API, method_name is the method to be called and reply_obj is the object with parameters.
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply_obj)
  };
  var response = UrlFetchApp.fetch(kety.telegram_url + method_name, options);
  return response;
}

function setWebhook(){
  // Register this Google WebApp as our Telegram bot Webhook. https://core.telegram.org/bots/api#setwebhook
  var response = kety.sendResponse('setWebhook', {'url': kety.webapp_url});
  Logger.log(response.getContentText());
}

/*
function scheduler(){
  // Register trigger for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('fetchIGPosts').timeBased().everyDays(1).atHour(9).nearMinute(10).create();
}
*/
