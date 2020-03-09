import React, {
  Component
} from 'react'
import Sidebar from './Sidebar';

const mapStyle = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  height: '100%'
};


class GoogleMap extends Component {
  componentDidMount() {
    var map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentPosition = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(currentPosition);
        },
        err => {
          console.error(err)
          map.setCenter(new window.google.maps.LatLng(40.416775, -3.70379))
          map.setZoom(6);
        }
      );
    } else {
      console.error("Geolocation not supported");
      map.setCenter(new window.google.maps.LatLng(40.416775, -3.70379))
      map.setZoom(6);
    }
  }

  render() {
    return (<>
      <div id = 'map' style = {mapStyle}/>
      <Sidebar></Sidebar>
    </>
    );
  }
}

export default GoogleMap;

var mapOptions = {
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



//esto sirve por ejemplo, poner la calle y que te devuelva la posicion, hace falta key
// var geocoder = new window.google.maps.Geocoder();
// geocoder.geocode({
//       'address': "Madrid"
//     }, function (results, status) {
//       if (status === 'OK') {
//         map.setCenter(results[0].geometry.location);
//         map.setZoom(8)
//       } else {
//         console.error('Geocode was not successful for the following reason: ' + status);
//       }