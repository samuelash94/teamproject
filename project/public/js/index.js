function displayPostField(){
	document.getElementById("postField").style.visibility = 'visible';
	document.getElementById("postHeader").style.visibility = 'visible';
	document.getElementById("postSubmit").style.visibility = 'visible';
}

function displayCommentField(){
  document.getElementById("commentTextField").style.visibility = 'visible';
	document.getElementById("commentSubmit").style.visibility = 'visible';
}

function hidePosts(){
	var x = document.getElementsByClassName("jumbotron");
	var i;
	for (i = 0; i < x.length; i++) {
    x[i].style.visibility = "hidden";
	}
}
