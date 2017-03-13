function displayGroupFields(){
	document.getElementById("groupName").style.visibility = 'visible';
	document.getElementById("groupDesc").style.visibility = 'visible';
	document.getElementById("groupPrivacy").style.visibility = 'visible';
	document.getElementById("groupSubmit").style.visibility = 'visible';
}

function hideGroups(){
	var x = document.getElementsByClassName("loadtheseGroups");
	var i;
	for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
	}
}
