function displayGroupFields(){
	document.getElementById("groupName").style.display = 'block';
	document.getElementById("groupDesc").style.display = 'block';
	document.getElementById("groupPrivacy").style.display = 'block';
	document.getElementById("groupSubmit").style.display = 'block';
}

function hideGroups(){
	var x = document.getElementsByClassName("loadtheseGroups");
	var i;
	for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
	}
}
