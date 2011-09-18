var googleplus = {
	//a
	mirror : 'http://www.nostuff.org/googleplus/prox.php?url=',
	googleplusbase : 'https://www.googleapis.com/plus/v1/',
	googleplusapikey : 'AIzaSyAf5DQCkpscKYOhdwrl71e-AaETA0ensNo',
	personid : '113029570517600774893',
};
var googlepluslist = new Array();
var googleactivity = {};


var printgoogleprofile = function() {
	var url = googleplus.mirror + googleplus.googleplusbase + 'people/' + googleplus.personid + '?key=' + googleplus.googleplusapikey;
	$.getJSON(url, function(data) {
		//data = data.contents;
		$('ul').append('<li>Name: ' + data.contents.displayName + '</li>');
		$('ul').append('<li>Gender: ' + data.contents.gender + '</li>');
		$('ul').append('<li>Google+ Id: ' + data.contents.id + '</li>');
		$('#imggoogle').attr('src', data.contents.image.url);
		//$('#json').append(data);
	});
}


var showgoogleactivity = function() {
	$('#googleplusactivity').html('<li>Loading...</li>');
	// build request string
	var url = googleplus.mirror + googleplus.googleplusbase + 'people/' + googleplus.personid + '/activities/public?key=' + googleplus.googleplusapikey + '%26maxResults=10';
	// add the next page url token if we have one (i.e we have already shown one set of results)
	var nextPageUrl;
	if (typeof googleactivity.nextPageToken !== 'undefined') {
		nextPageUrl = '%26pageToken=' + googleactivity.nextPageToken;
		url = url + nextPageUrl;
	}
	$.getJSON(url, function(data) {
		googleactivity = data.contents;
		// print title
		$('#plusactivitytitle').html(data.contents.title);
		$('#googleplusactivity').html('');
		for (i in data.contents.items) {
			$('#googleplusactivity').append('<li>' + data.contents.items[i]['title'] + '</li>');
			googlepluslist[i] = data.contents.items[i]['id'];
		}	
	});
}

var showitemdetail = function(id) {
	$('#largebox').css('display', 'block').html(googleactivity.items[id]['title']).append('<ul>');
	$.each(googleactivity.items[id], function(index, value) {
		//$('#json').append('<br>' + index + ' : ' + value);
		$('#largebox').append('<li>' + index + ' : ' + value + '</li>');
	
	});
	$('#largebox').append('<div class="bottomtext">');
	$('.bottomtext').append('<p>[ x/esc to close | n next]</p>');
	googleplus.state = "showingitem";
	googleplus.currentid = id;
	
}


$(function() {
	// show basics
	printgoogleprofile();
	showgoogleactivity();
	
	$(document).keyup(function(event) {
		//
		var character = String.fromCharCode(event.keyCode).toLowerCase();
		//alert (event.keyCode);
		// if showing an item, limit what keys we can press
		if (googleplus.state === "showingitem") {
			// to close
			if (character === 'x' || event.keyCode === 27) {
				googleplus.state = "home";
				$('#largebox').css('display','none');
			}
			// to move on to next
			else if (character === 'n') {
				var newid = parseInt(googleplus.currentid);
				newid++;
				showitemdetail(newid);
			}
			// otherwise ignore keyboard input
			return;
		}
		// for normal operation...
		// show a record
	  	if (/[0-9]/.test(character) ) {
			$('#json').html('Option: ' + character);
			showitemdetail(character);
		}
		// show next ten items
		else if (character === 'n') {
			showgoogleactivity();
		}
		else if (character === 'r') {
			googleactivity = {};
			showgoogleactivity();
			alert('reload');
		}
		
	});
	


	
	
// https://www.googleapis.com/plus/v1/people/113029570517600774893/activities/public?key=AIzaSyAf5DQCkpscKYOhdwrl71e-AaETA0ensNo
});	

	
	