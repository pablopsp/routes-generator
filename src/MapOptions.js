const mapOptions = {
  zoom: 13,
  mapTypeId: "roadmap",
  mapTypeControl: false,
  styles: [{
    "featureType": "poi.attraction",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "poi.business",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "poi.government",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "poi.medical",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "poi.medical",
    "elementType": "geometry",
    "stylers": [{
      "visibility": "on"
    }]
  },
  {
    "featureType": "poi.park",
    "stylers": [{
      "visibility": "on"
    }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [{
      "visibility": "on"
    }]
  },
  {
    "featureType": "poi.place_of_worship",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "poi.school",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "poi.sports_complex",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit.line",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit.station",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit.station.airport",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit.station.bus",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit.station.rail",
    "stylers": [{
      "visibility": "off"
    }]
  }
  ]
};

export default mapOptions;