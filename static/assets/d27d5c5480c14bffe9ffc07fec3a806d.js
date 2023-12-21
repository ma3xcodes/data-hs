ace.define("ace/ext/spellcheck",["require","exports","module","ace/lib/event","ace/editor","ace/config"],(function(e,t,n){"use strict";var o=e("../lib/event");t.contextMenuHandler=function(e){var t=e.target,n=t.textInput.getElement();if(t.selection.isEmpty()){var i=t.getCursorPosition(),s=t.session.getWordRange(i.row,i.column),r=t.session.getTextRange(s);if(t.session.tokenRe.lastIndex=0,t.session.tokenRe.test(r)){var c=r+" ";n.value=c,n.setSelectionRange(r.length,r.length+1),n.setSelectionRange(0,0),n.setSelectionRange(0,r.length);var l=!1;o.addListener(n,"keydown",(function onKeydown(){o.removeListener(n,"keydown",onKeydown),l=!0})),t.textInput.setInputHandler((function(e){if(e==c)return"";if(0===e.lastIndexOf(c,0))return e.slice(c.length);if(e.substr(n.selectionEnd)==c)return e.slice(0,-c.length);if(""==e.slice(-2)){var o=e.slice(0,-2);if(" "==o.slice(-1))return l?o.substring(0,n.selectionEnd):(o=o.slice(0,-1),t.session.replace(s,o),"")}return e}))}}};var i=e("../editor").Editor;e("../config").defineOptions(i.prototype,"editor",{spellcheck:{set:function(e){this.textInput.getElement().spellcheck=!!e,e?this.on("nativecontextmenu",t.contextMenuHandler):this.removeListener("nativecontextmenu",t.contextMenuHandler)},value:!0}})})),ace.require(["ace/ext/spellcheck"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));