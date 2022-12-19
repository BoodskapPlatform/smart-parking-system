ace.define("ace/snippets/sql",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet select\n\
	select * from ${1:table}\n\
";
exports.scope = "sql";

});
