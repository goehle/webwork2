$(function () {

    cm = CodeMirror.fromTextArea(
	$("#problemContents")[0],
	{mode: "PG",
	 indentUnit: 4,
	 tabMode: "spaces",
         lineNumbers: true,
         extraKeys:
             {Tab: function(cm) {cm.execCommand('insertSoftTab')}},
         inputStyle: "textarea",         
    });
    cm.setSize(700,400);

});
