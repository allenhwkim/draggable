/**
 * Display console output to textarea at the bottom of the page.
 * Usage: konsole.log(1,2,3,4,5)
 */
class Konsole {
  constructor() {
    this.appendKonsoleTextarea();
  }
  
  log() {
    document.querySelector("#konsole").value += 
    Array.prototype.slice.call(arguments).join(" ") + "\n";
  }
  
  appendKonsoleTextarea() {
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id', 'konsole');
    textarea.setAttribute('style', 'position:fixed;bottom:0;left:0;width:100%;height:150px;z-index:1000;');
    textarea.setAttribute('placeholder', 'console output by https://github.com/allenhwkim/scripts/konsole.js');
    document.body.appendChild(textarea);
  }
}
