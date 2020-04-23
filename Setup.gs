/* Script for basic and initial configuration, webhooks and generic functions. */

/* WebApp basic functions, doPost is on Bot.gs file. */

function getMe(){
  // Connect our bot to Telegram bots API. https://core.telegram.org/bots/api#making-requests
  var url = kety.telegram_url + 'getMe';
  var response = UrlFetchApp.fetch(url);
  console.log(response.getContentText());
}

function doGet(obj){
  // Listener for get method of this Google WebApp, obj is the input request.
  return HtmlService.createHtmlOutput('How you doin? ' + JSON.stringify(obj));
}

/* Generic multipurpose functions. */

kety.sendResponse = function(method_name, reply_obj){
  // Generic function to send and return a response to Telegram Bot API, method_name is the method to be called and reply_obj is the object with parameters.
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(reply_obj),
  };
  var response = UrlFetchApp.fetch(kety.telegram_url + method_name, options);
  return response;
}

kety.escapeMarkdown = function(word){
  // Generic helper function to escape Markdown special characters.
  return word.replace(/_/g, '\\_').replace(/\*/g, '\\*').replace(/\[/g, '\\[').replace(/`/g, '\\`');
}

/* Webhook functions. */

function setWebhook(){
  // Register this Google WebApp as our Telegram bot Webhook. https://core.telegram.org/bots/api#setwebhook
  var response = kety.sendResponse('setWebhook', {'url': kety.webapp_url});
  console.log(response.getContentText());
}

function deleteWebhook(){
  // Remove this Google WebApp as our Telegram bot Webhook. https://core.telegram.org/bots/api#deletewebhook
  var response = kety.sendResponse('deleteWebhook', {});
  console.log(response.getContentText());
}
