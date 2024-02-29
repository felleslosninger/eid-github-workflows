// For testing purpose - is not in use in ANY workflows

module.exports.decode = function(encodedString) {
  if (encodedString !== null && encodedString.trim().length > 0) {
    return atob(encodedString);
  } else {
    console.error("String was null or empty - cannot not decode");
    return '';
  }
}

module.exports.encode = function(string) {
  if (string !== null && string.length > 0) {
    return btoa(string);
  } else {
    console.log("String was null or empty - cannot not encode");
    return '';
  }
}
