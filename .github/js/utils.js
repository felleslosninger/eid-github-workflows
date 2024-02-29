/**
 * Create and populate an array from a string with a delimiter.
 * @param  {[String]} theString [A string with values and a separator token (delimiter)]
 * @param  {[type]} arg2 [description]
 * @return {[array]}      [An array representation of the string]
 */
module.exports.toArrayFromString = function(theString, separatorToken) {
  let data = [];
  for (let string of theString.split(separatorToken)) {
    if (string !== '') {
      data.push(string.trim().replace(/,$/, ""));
    }
  }
  return data;
}

module.exports.getSuppressedOrUnSuppressedEventType = function(suppression) {
  let event_type = '';
  if (suppression !== "" && !suppression.startsWith("#")) {
    if (suppression.startsWith("+")) {
      event_type = "suppressed";
    } else if (suppression.startsWith("-")) {
      event_type = "un-suppressed";
    }
  }
  return event_type;
}