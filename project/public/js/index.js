

$(document).ready(function () {


	function divClicked() {
	    var divHtml = $(this).prev('textarea').html(); //select's the contents of div immediately previous to the button
	    var editableText = $("<textarea class='form-control' />");
	    editableText.val(divHtml);
	    $(this).prev('textarea').replaceWith(editableText); //replaces the required div with textarea
	    editableText.focus();
	    // setup the blur event for this new textarea
	    editableText.blur(editableTextBlurred);
	}

	function editableTextBlurred() {
	    var html = $(this).val();
	    var viewableText = $("<textarea>");
	    viewableText.html(html);
	    $(this).replaceWith(viewableText);
	    // setup the click event for this new div
	    viewableText.click(divClicked);
	}


    $(".editableComment").click(divClicked); //calls the function on button click
});

function displayPostField(){
	document.getElementById("postField").style.display = 'block';
	document.getElementById("postHeader").style.display = 'block';
	document.getElementById("postSubmit").style.display = 'block';
}

function displayCommentField(){

  document.getElementById("commentTextField").style.display = 'block';
	document.getElementById("commentSubmit").style.display = 'block';

}

function hidePosts(){
	var x = document.getElementsByClassName("loadthesePosts");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
}
