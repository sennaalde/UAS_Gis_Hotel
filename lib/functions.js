var map;
var json = (function() {
	var json = null;
	$.ajax({
		'async' : false,
		'global' : false,
		'url' : "data/hotels.json",
		'dataType' : "json",
		'success' : function(data) {
			json = data;
		}
	});
	return json;
})();

$(function() {
	var $header = $('#head');
	var $content = $('#map-canvas');
	var $window = $(window).on('resize', function() {
		var height = $(window).height() - 145;
		$content.height(height);
	}).trigger('resize');
	//on page load

	var output = '';
	for (var i = 0, length = json.length; i < length; i++) {
		var data = json[i];
		output += '<li><a href="#page1" onclick="newLocation(' + data.lat + ',' + data.lng + ')"><img src="'+ data.image +'"><h1>' + data.name + '</h1> <p>'+data.content+'</p></a></li>';
	}
	$('#daftarhotel').append(output);
});

function newLocation(newLat,newLng) {
    map.setCenter({
        lat : newLat,
        lng : newLng
    });
    map.setZoom(18);
}

function initialize() {
	var latitude = -7.9784695, longitude = 112.561742, radius = 8000, //how is this set up
	center = new google.maps.LatLng(latitude, longitude), mapOptions = {
		center : center,
		zoom : 9,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		scrollwheel : false,
		disableDefaultUI: true,
		zoomControl: true
	};
	//SetMap
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	//Setting Custom Icon
	var icon = {
		url : 'image/hotelcilik.png',
		// This marker is 20 pixels wide by 32 pixels high.
		size : new google.maps.Size(50, 50),
		// The origin for this image is (0, 0).
		origin : new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at (0, 32).
		anchor : new google.maps.Point(0, 50)
	};

	setMarkers(center, radius, icon, map);
}

function setMarkers(center, radius, icon, map) {
	//loop between each of the json elements
	for (var i = 0, length = json.length; i < length; i++) {
		var data = json[i], latLng = new google.maps.LatLng(data.lat, data.lng);

		// Creating a marker and putting it on the map
		var marker = new google.maps.Marker({
			position : latLng,
			map : map,
			icon : icon,
			title : data.content
		});
		infoBox(map, marker, data);
	}
}

function infoBox(map, marker, data) {
	var infoWindow = new google.maps.InfoWindow();
	// Attaching a click event to the current marker
	google.maps.event.addListener(marker, "click", function(e) {
		infoWindow.setContent(data.content);
		infoWindow.open(map, marker);
	});

	// Creating a closure to retain the correct data
	// Note how I pass the current data in the loop into the closure (marker, data)
	(function(marker, data) {
		// Attaching a click event to the current marker
		google.maps.event.addListener(marker, "click", function(e) {
			infoWindow.setContent("<img src='" + data.image + "'><br>" + data.content);
			infoWindow.open(map, marker);
		});
	})(marker, data);
}

google.maps.event.addDomListener(window, 'load', initialize); 