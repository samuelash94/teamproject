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
