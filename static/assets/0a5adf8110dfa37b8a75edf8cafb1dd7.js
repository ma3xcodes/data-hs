ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],(function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./text_highlight_rules").TextHighlightRules,DocCommentHighlightRules=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},DocCommentHighlightRules.getTagRule(),{defaultToken:"comment.doc",caseInsensitive:!0}]}};i.inherits(DocCommentHighlightRules,o),DocCommentHighlightRules.getTagRule=function(e){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"}},DocCommentHighlightRules.getStartRule=function(e){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:e}},DocCommentHighlightRules.getEndRule=function(e){return{token:"comment.doc",regex:"\\*\\/",next:e}},t.DocCommentHighlightRules=DocCommentHighlightRules})),ace.define("ace/mode/haxe_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],(function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./doc_comment_highlight_rules").DocCommentHighlightRules,r=e("./text_highlight_rules").TextHighlightRules,HaxeHighlightRules=function(){var e=this.createKeywordMapper({"variable.language":"this",keyword:"break|case|cast|catch|class|continue|default|else|enum|extends|for|function|if|implements|import|in|inline|interface|new|override|package|private|public|return|static|super|switch|this|throw|trace|try|typedef|untyped|var|while|Array|Void|Bool|Int|UInt|Float|Dynamic|String|List|Hash|IntHash|Error|Unknown|Type|Std","constant.language":"null|true|false"},"identifier");this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},o.getStartRule("doc-start"),{token:"comment",regex:"\\/\\*",next:"comment"},{token:"string.regexp",regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:e,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"},{token:"punctuation.operator",regex:"\\?|\\:|\\,|\\;|\\."},{token:"paren.lparen",regex:"[[({<]"},{token:"paren.rparen",regex:"[\\])}>]"},{token:"text",regex:"\\s+"}],comment:[{token:"comment",regex:"\\*\\/",next:"start"},{defaultToken:"comment"}]},this.embedRules(o,"doc-",[o.getEndRule("start")])};i.inherits(HaxeHighlightRules,r),t.HaxeHighlightRules=HaxeHighlightRules})),ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],(function(e,t,n){"use strict";var i=e("../range").Range,MatchingBraceOutdent=function(){};(function(){this.checkOutdent=function(e,t){return!!/^\s+$/.test(e)&&/^\s*\}/.test(t)},this.autoOutdent=function(e,t){var n=e.getLine(t).match(/^(\s*\})/);if(!n)return 0;var o=n[1].length,r=e.findMatchingBracket({row:t,column:o});if(!r||r.row==t)return 0;var a=this.$getIndent(e.getLine(r.row));e.replace(new i(t,0,t,o-1),a)},this.$getIndent=function(e){return e.match(/^\s*/)[0]}}).call(MatchingBraceOutdent.prototype),t.MatchingBraceOutdent=MatchingBraceOutdent})),ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],(function(e,t,n){"use strict";var i=e("../../lib/oop"),o=e("../../range").Range,r=e("./fold_mode").FoldMode,a=t.FoldMode=function(e){e&&(this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+e.start)),this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+e.end)))};i.inherits(a,r),function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/,this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/,this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/,this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/,this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/,this._getFoldWidgetBase=this.getFoldWidget,this.getFoldWidget=function(e,t,n){var i=e.getLine(n);if(this.singleLineBlockCommentRe.test(i)&&!this.startRegionRe.test(i)&&!this.tripleStarBlockCommentRe.test(i))return"";var o=this._getFoldWidgetBase(e,t,n);return!o&&this.startRegionRe.test(i)?"start":o},this.getFoldWidgetRange=function(e,t,n,i){var o,r=e.getLine(n);if(this.startRegionRe.test(r))return this.getCommentRegionBlock(e,r,n);if(o=r.match(this.foldingStartMarker)){var a=o.index;if(o[1])return this.openingBracketBlock(e,o[1],n,a);var s=e.getCommentFoldRange(n,a+o[0].length,1);return s&&!s.isMultiLine()&&(i?s=this.getSectionRange(e,n):"all"!=t&&(s=null)),s}if("markbegin"!==t&&(o=r.match(this.foldingStopMarker))){a=o.index+o[0].length;return o[1]?this.closingBracketBlock(e,o[1],n,a):e.getCommentFoldRange(n,a,-1)}},this.getSectionRange=function(e,t){for(var n=e.getLine(t),i=n.search(/\S/),r=t,a=n.length,s=t+=1,c=e.getLength();++t<c;){var g=(n=e.getLine(t)).search(/\S/);if(-1!==g){if(i>g)break;var l=this.getFoldWidgetRange(e,"all",t);if(l){if(l.start.row<=r)break;if(l.isMultiLine())t=l.end.row;else if(i==g)break}s=t}}return new o(r,a,s,e.getLine(s).length)},this.getCommentRegionBlock=function(e,t,n){for(var i=t.search(/\s*$/),r=e.getLength(),a=n,s=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,c=1;++n<r;){t=e.getLine(n);var g=s.exec(t);if(g&&(g[1]?c--:c++,!c))break}if(n>a)return new o(a,i,n,t.length)}}.call(a.prototype)})),ace.define("ace/mode/haxe",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/haxe_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],(function(e,t,n){"use strict";var i=e("../lib/oop"),o=e("./text").Mode,r=e("./haxe_highlight_rules").HaxeHighlightRules,a=e("./matching_brace_outdent").MatchingBraceOutdent,s=e("./behaviour/cstyle").CstyleBehaviour,c=e("./folding/cstyle").FoldMode,Mode=function(){this.HighlightRules=r,this.$outdent=new a,this.$behaviour=new s,this.foldingRules=new c};i.inherits(Mode,o),function(){this.lineCommentStart="//",this.blockComment={start:"/*",end:"*/"},this.getNextLineIndent=function(e,t,n){var i=this.$getIndent(t),o=this.getTokenizer().getLineTokens(t,e).tokens;if(o.length&&"comment"==o[o.length-1].type)return i;"start"==e&&(t.match(/^.*[\{\(\[]\s*$/)&&(i+=n));return i},this.checkOutdent=function(e,t,n){return this.$outdent.checkOutdent(t,n)},this.autoOutdent=function(e,t,n){this.$outdent.autoOutdent(t,n)},this.$id="ace/mode/haxe"}.call(Mode.prototype),t.Mode=Mode})),ace.require(["ace/mode/haxe"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));