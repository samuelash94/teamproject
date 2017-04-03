

$(document).ready(function () {

	$('.dropdown-toggle').dropdown('toggle');
	$('.dropdown-toggle').dropdown('toggle');

	$('.selectpicker').selectpicker('toggle');
	$(document).scrollTop(0);


	function divClicked() {
	    var divHtml = $(this).prev('textarea').html(); //select's the contents of div immediately previous to the button
	    var editableText = $("<textarea class='form-control' name = 'commentText' />");
	    editableText.val(divHtml);
	    $(this).prev('textarea').replaceWith(editableText); //replaces the required div with textarea
	    editableText.focus();
	    // setup the blur event for this new textarea
	    editableText.blur(editableTextBlurred);
	}

	function editableTextBlurred() {
	    var html = $(this).val();
	    var viewableText = $("<textarea class='form-control' name = 'commentText'>");
	    viewableText.html(html);
	    $(this).replaceWith(viewableText);
	    // setup the click event for this new div
	    viewableText.click(divClicked);
	}


    $(".commentEditButton").click(divClicked); //calls the function on button click

		/****************************************************************************************************************************************/

		function postDivClicked() {
		    var divHtml = $(this).prev('textarea').html(); //select's the contents of div immediately previous to the button
		    var editableText = $("<textarea class='form-control' rows = '10' name = 'PostText'  />");
		    editableText.val(divHtml);
		    $(this).prev('textarea').replaceWith(editableText); //replaces the required div with textarea
		    editableText.focus();
		    // setup the blur event for this new textarea
		    editableText.blur(postEditableTextBlurred);
		}

		function postEditableTextBlurred() {
		    var html = $(this).val();
		    var viewableText = $("<textarea class='form-control' rows = '10' name = 'PostText'>");
		    viewableText.html(html);
		    $(this).replaceWith(viewableText);
		    // setup the click event for this new div
		    viewableText.click(postDivClicked);
		}


	    $(".postEditButton").click(postDivClicked); //calls the function on button click

		$('.upload-btn').on('click', function (){
		    $('#upload-input').click();
		    $('.progress-bar').text('0%');
		    $('.progress-bar').width('0%');
		});

		function sendMyAjax(option, itemId, formData){
			var theUrl;
			switch (option) {
				case 'lostItem':
					theUrl = "/lostItems/upload/" + itemId;
					break;
				default: theUrl = '/users/upload/' + option;
			}
			$.ajax({
				url: theUrl,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
						console.log('upload successful!\n' + data);
				},
				xhr: function() {
					// create an XMLHttpRequest
					var xhr = new XMLHttpRequest();

					// listen to the 'progress' event
					xhr.upload.addEventListener('progress', function(evt) {

						if (evt.lengthComputable) {
							// calculate the percentage of upload completed
							var percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);

							// update the Bootstrap progress bar with the new percentage
							$('.progress-bar').text(percentComplete + '%');
							$('.progress-bar').width(percentComplete + '%');

							// once the upload reaches 100%, set the progress bar text to done
							if (percentComplete === 100) {
								$('.progress-bar').html('Done');
							}

						}

					}, false);

					return xhr;
				}
			});
		}

		$('#upload-input').on('change', function(){

		  var files = $(this).get(0).files;

		  if (files.length > 0){
		    // create a FormData object which will be sent as the data payload in the
		    // AJAX request
		    var formData = new FormData();

		    // loop through all the selected files and add them to the formData object
		    for (var i = 0; i < files.length; i++) {
		      var file = files[i];

		      // add the files to formData object for the data payload
		      formData.append('uploads[]', file, file.name);
		    }

				var theOption = $('input[name=UploadOptions]:checked').val();
				var itemId = $('input[name=itemId]').val();

				// my function goes here

				sendMyAjax(theOption, itemId, formData);

		  }
		});
});

function displayPostField(){
	document.getElementById("postField").style.display = 'block';
	document.getElementById("postHeader").style.display = 'block';
	document.getElementById("postSubmit").style.display = 'block';
	document.getElementById("visibility").style.display = 'block';
}

function displayCommentField(){

  document.getElementById("commentTextField").style.display = 'block';
	document.getElementById("commentSubmit").style.display = 'block';

}

function displayScheduleFields(){

	document.getElementById("createSchedule").style.display = 'block';

}

function selectCheck(select){
    console.log(select);
    if(select){
        optionValue = document.getElementById("listOnly").value;
        if(optionValue == select.value){
            document.getElementById("friendListDiv").style.display = "block";
        }
        else{
            document.getElementById("friendListDiv").style.display = "none";
        }
    }
    else{
        document.getElementById("friendListDiv").style.display = "none";
    }
}

function hidePosts(){
	var x = document.getElementsByClassName("loadthesePosts");
	var i;
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
}

function initMap(id) {
        var map = new google.maps.Map(document.getElementsByClassName(id)[1], {
          zoom: 11,
          center: {lat: -34.397, lng: 150.644}
        });
        var geocoder = new google.maps.Geocoder();
          geocodeAddress(geocoder, map, id);
      }

      function geocodeAddress(geocoder, resultsMap, id) {
        var address = document.getElementsByClassName(id)[0].value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
							title: 'Location is found here',
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
