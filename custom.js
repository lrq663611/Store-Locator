// Store locator with customisations
// - custom marker
// - custom info window (using Info Bubble)
// - custom info window content (+ store hours)

var ICON = new google.maps.MarkerImage('black-marker.png', null, null,
    new google.maps.Point(14, 13));

google.maps.event.addDomListener(window, 'load', function() {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(-33.851733, 150.999968),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var panelDiv = document.getElementById('panel');

  var data = new DataSource;

  var view = new storeLocator.View(map, data, {
    geolocation: false,
    features: data.getFeatures()
  });

  view.createMarker = function(store) {
    var markerOptions = {
      position: store.getLocation(),
      icon: ICON,
      title: store.getDetails().title
    };
    var marker = new google.maps.Marker(markerOptions);
	new google.maps.event.addListener( marker, 'click', function(){
		setTimeout(function(){
			$("#map-canvas .store").parent().parent().css("height", "150");
		}, 100);
	} );
	return marker;
  }

  var infoBubble = new InfoBubble;
  view.getInfoWindow = function(store) {
    if (!store) {
      return infoBubble;
    }

    var details = store.getDetails();

    var html = ['<div class="store"><div class="title">', details.title,
      '</div><div class="address">', details.address, '</div>',
      '<div class="hours misc">', details.hours, '</div></div>'].join('');

    infoBubble.setContent($(html)[0]);
    return infoBubble;
  };

  new storeLocator.Panel(panelDiv, {
    view: view,
	locationSearchLabel: "Search by suburb, postcode or state."
  });
});
