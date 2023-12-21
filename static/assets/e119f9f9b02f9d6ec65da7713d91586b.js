ace.define("ace/ext/hardwrap",["require","exports","module","ace/range","ace/editor","ace/config"],(function(e,t,n){"use strict";var r=e("../range").Range;function hardWrap(e,t){for(var n=t.column||e.getOption("printMarginColumn"),a=0!=t.allowMerge,o=Math.min(t.startRow,t.endRow),i=Math.max(t.startRow,t.endRow),s=e.session;o<=i;){var l=s.getLine(o);if(l.length>n){if(g=findSpace(l,n,5)){var c=/^\s*/.exec(l)[0];s.replace(new r(o,g.start,o,g.end),"\n"+c)}i++}else if(a&&/\S/.test(l)&&o!=i){var d=s.getLine(o+1);if(d&&/\S/.test(d)){var g,p=l.replace(/\s+$/,""),f=d.replace(/^\s+/,""),h=p+" "+f;if((g=findSpace(h,n,5))&&g.start>p.length||h.length<n){var u=new r(o,p.length,o+1,d.length-f.length);s.replace(u," "),o--,i--}else p.length<l.length&&s.remove(new r(o,p.length,o,l.length))}}o++}function findSpace(e,t,n){if(!(e.length<t)){var r=e.slice(0,t),a=e.slice(t),o=/^(?:(\s+)|(\S+)(\s+))/.exec(a),i=/(?:(\s+)|(\s+)(\S+))$/.exec(r),s=0,l=0;return i&&!i[2]&&(s=t-i[1].length,l=t),o&&!o[2]&&(s||(s=t),l=t+o[1].length),s?{start:s,end:l}:i&&i[2]&&i.index>n?{start:i.index,end:i.index+i[2].length}:o&&o[2]?{start:s=t+o[2].length,end:s+o[3].length}:void 0}}}function wrapAfterInput(e){if("insertstring"==e.command.name&&/\S/.test(e.args)){var t=e.editor,n=t.selection.cursor;if(n.column<=t.renderer.$printMarginColumn)return;var r=t.session.$undoManager.$lastDelta;hardWrap(t,{startRow:n.row,endRow:n.row,allowMerge:!1}),r!=t.session.$undoManager.$lastDelta&&t.session.markUndoGroup()}}var a=e("../editor").Editor;e("../config").defineOptions(a.prototype,"editor",{hardWrap:{set:function(e){e?this.commands.on("afterExec",wrapAfterInput):this.commands.off("afterExec",wrapAfterInput)},value:!1}}),t.hardWrap=hardWrap})),ace.require(["ace/ext/hardwrap"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));