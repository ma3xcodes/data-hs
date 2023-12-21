ace.define("ace/mode/coffee_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],(function(e,t,n){"use strict";var r=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules;function CoffeeHighlightRules(){var e="[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",t="case|const|function|var|void|with|enum|implements|interface|let|package|private|protected|public|static",n=this.createKeywordMapper({keyword:"this|throw|then|try|typeof|super|switch|return|break|by|continue|catch|class|in|instanceof|is|isnt|if|else|extends|for|own|finally|function|while|when|new|no|not|delete|debugger|do|loop|of|off|or|on|unless|until|and|yes|yield|export|import|default","constant.language":"true|false|null|undefined|NaN|Infinity","invalid.illegal":t,"language.support.class":"Array|Boolean|Date|Function|Number|Object|RegExp|ReferenceError|String|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray","language.support.function":"Math|JSON|isNaN|isFinite|parseInt|parseFloat|encodeURI|encodeURIComponent|decodeURI|decodeURIComponent|String|","variable.language":"window|arguments|prototype|document"},"identifier"),r={token:["paren.lparen","variable.parameter","paren.rparen","text","storage.type"],regex:/(?:(\()((?:"[^")]*?"|'[^')]*?'|\/[^\/)]*?\/|[^()"'\/])*?)(\))(\s*))?([\-=]>)/.source},o=/\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)/;this.$rules={start:[{token:"constant.numeric",regex:"(?:0x[\\da-fA-F]+|(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?)"},{stateName:"qdoc",token:"string",regex:"'''",next:[{token:"string",regex:"'''",next:"start"},{token:"constant.language.escape",regex:o},{defaultToken:"string"}]},{stateName:"qqdoc",token:"string",regex:'"""',next:[{token:"string",regex:'"""',next:"start"},{token:"paren.string",regex:"#{",push:"start"},{token:"constant.language.escape",regex:o},{defaultToken:"string"}]},{stateName:"qstring",token:"string",regex:"'",next:[{token:"string",regex:"'",next:"start"},{token:"constant.language.escape",regex:o},{defaultToken:"string"}]},{stateName:"qqstring",token:"string.start",regex:'"',next:[{token:"string.end",regex:'"',next:"start"},{token:"paren.string",regex:"#{",push:"start"},{token:"constant.language.escape",regex:o},{defaultToken:"string"}]},{stateName:"js",token:"string",regex:"`",next:[{token:"string",regex:"`",next:"start"},{token:"constant.language.escape",regex:o},{defaultToken:"string"}]},{regex:"[{}]",onMatch:function(e,t,n){return this.next="","{"==e&&n.length?(n.unshift("start",t),"paren"):"}"==e&&n.length&&(n.shift(),this.next=n.shift()||"",-1!=this.next.indexOf("string"))?"paren.string":"paren"}},{token:"string.regex",regex:"///",next:"heregex"},{token:"string.regex",regex:/(?:\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)(?:[imgy]{0,4})(?!\w)/},{token:"comment",regex:"###(?!#)",next:"comment"},{token:"comment",regex:"#.*"},{token:["punctuation.operator","text","identifier"],regex:"(\\.)(\\s*)("+t+")"},{token:"punctuation.operator",regex:"\\.{1,3}"},{token:["keyword","text","language.support.class","text","keyword","text","language.support.class"],regex:"(class)(\\s+)("+e+")(?:(\\s+)(extends)(\\s+)("+e+"))?"},{token:["entity.name.function","text","keyword.operator","text"].concat(r.token),regex:"("+e+")(\\s*)([=:])(\\s*)"+r.regex},r,{token:"variable",regex:"@(?:"+e+")?"},{token:n,regex:e},{token:"punctuation.operator",regex:"\\,|\\."},{token:"storage.type",regex:"[\\-=]>"},{token:"keyword.operator",regex:"(?:[-+*/%<>&|^!?=]=|>>>=?|\\-\\-|\\+\\+|::|&&=|\\|\\|=|<<=|>>=|\\?\\.|\\.{2,3}|[!*+-=><])"},{token:"paren.lparen",regex:"[({[]"},{token:"paren.rparen",regex:"[\\]})]"},{token:"text",regex:"\\s+"}],heregex:[{token:"string.regex",regex:".*?///[imgy]{0,4}",next:"start"},{token:"comment.regex",regex:"\\s+(?:#.*)?"},{token:"string.regex",regex:"\\S+"}],comment:[{token:"comment",regex:"###",next:"start"},{defaultToken:"comment"}]},this.normalizeRules()}r.inherits(CoffeeHighlightRules,o),t.CoffeeHighlightRules=CoffeeHighlightRules})),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],(function(e,t,n){"use strict";var r=e("../range").Range,MatchingBraceOutdent=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t).match(/^(\s*\})/);if(!n)return 0;var o=n[1].length,a=e.findMatchingBracket({row:t,column:o});if(!a||a.row==t)return 0;var i=this.$getIndent(e.getLine(a.row));e.replace(new r(t,0,t,o-1),i)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(MatchingBraceOutdent.prototype),t.MatchingBraceOutdent=MatchingBraceOutdent})),ace.define("ace/mode/folding/coffee",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range"],(function(e,t,n){"use strict";var r=e("../../lib/oop"),o=e("./fold_mode").FoldMode,a=e("../../range").Range,i=t.FoldMode=function(){};r.inherits(i,o),function(){this.getFoldWidgetRange=function(e,t,n){var r=this.indentationBlock(e,n);if(r)return r;var o=/\S/,i=e.getLine(n),s=i.search(o);if(-1!=s&&"#"==i[s]){for(var g=i.length,c=e.getLength(),f=n,u=n;++n<c;){var l=(i=e.getLine(n)).search(o);if(-1!=l){if("#"!=i[l])break;u=n}}if(u>f){var d=e.getLine(u).length;return new a(f,g,u,d)}}},this.getFoldWidget=function(e,t,n){var r=e.getLine(n),o=r.search(/\S/),a=e.getLine(n+1),i=e.getLine(n-1),s=i.search(/\S/),g=a.search(/\S/);if(-1==o)return e.foldWidgets[n-1]=-1!=s&&s<g?"start":"","";if(-1==s){if(o==g&&"#"==r[o]&&"#"==a[o])return e.foldWidgets[n-1]="",e.foldWidgets[n+1]="","start"}else if(s==o&&"#"==r[o]&&"#"==i[o]&&-1==e.getLine(n-2).search(/\S/))return e.foldWidgets[n-1]="start",e.foldWidgets[n+1]="","";return e.foldWidgets[n-1]=-1!=s&&s<o?"start":"",o<g?"start":""}}.call(i.prototype)})),ace.define("ace/mode/coffee",["require","exports","module","ace/mode/coffee_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/folding/coffee","ace/range","ace/mode/text","ace/worker/worker_client","ace/lib/oop"],(function(e,t,n){"use strict";var r=e("./coffee_highlight_rules").CoffeeHighlightRules,o=e("./matching_brace_outdent").MatchingBraceOutdent,a=e("./folding/coffee").FoldMode,i=(e("../range").Range,e("./text").Mode),s=e("../worker/worker_client").WorkerClient;function Mode(){this.HighlightRules=r,this.$outdent=new o,this.foldingRules=new a}e("../lib/oop").inherits(Mode,i),function(){var e=/(?:[({[=:]|[-=]>|\b(?:else|try|(?:swi|ca)tch(?:\s+[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$|^\s*(else\b\s*)?(?:if|for|while|loop)\b(?!.*\bthen\b)/;this.lineCommentStart="#",this.blockComment={start:"###",end:"###"},this.getNextLineIndent=function(t,n,r){var o=this.$getIndent(n),a=this.getTokenizer().getLineTokens(n,t).tokens;return a.length&&"comment"===a[a.length-1].type||"start"!==t||!e.test(n)||(o+=r),o},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.createWorker=function(e){var t=new s(["ace"],"ace/mode/coffee_worker","Worker");return t.attachToDocument(e.getDocument()),t.on("annotate",(function(t){e.setAnnotations(t.data)})),t.on("terminate",(function(){e.clearAnnotations()})),t},this.$id="ace/mode/coffee",this.snippetFileId="ace/snippets/coffee"}.call(Mode.prototype),t.Mode=Mode})),ace.require(["ace/mode/coffee"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));