/* Script for scheduled and maintenance tasks. */

/*
function scheduler(){
  // Register trigger for this Google WebApp, based on time rules.
  ScriptApp.newTrigger('fetchIGPosts').timeBased().everyDays(1).atHour(9).nearMinute(10).create();
}
*/

var tasks = {};

tasks.blockGroupPermissions = function(){
  // TODO: programar que abra el grupos de novatos y una acción para que lo cierre

}
