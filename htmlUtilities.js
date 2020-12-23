//thanks robert k from https://stackoverflow.com/questions/5796718/html-entity-decode
//Decodes HTML encoded strings
//Usage: decodedString = decodeEntities(string)
var decodeEntities = (function() {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');
  
    function decodeHTMLEntities (str) {
      if(str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
      }
  
      return str;
    }
  
    return decodeHTMLEntities;
  })();

//thanks david hedlund https://stackoverflow.com/questions/27422951/javascript-how-to-paste-as-plain-text-in-multiple-fields-or-elements
//Makes it so that pasting only pastes plain text
var plainTextPaste = function(e) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
}