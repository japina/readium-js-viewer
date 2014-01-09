function initDialog(){
	$( "#epubdialog" ).dialog({
		dialogClass: "no-close",
/*	buttons: [
		{
			text: "Exit",
				click: function() {
					$( this ).dialog( "close" );
				}
			}
		], */
		width: 400,
		height: 800,
		autoOpen: false
	});
	console.log("init finished");
}

function openDialog(){
	$("#epubdialog").dialog("open");
}
$(document).ready(function(){
	$("a").click(function(){
		openDialog();		
	})
	initDialog();
});