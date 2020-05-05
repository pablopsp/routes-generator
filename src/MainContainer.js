import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
import Sidebar from "./Sidebar";

const mapStyle = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
  height: "100%",
};

const arrowNav = {
  position: "absolute",
  marginTop: "15px",
  backgroundColor: "white",
};

const btnStyle = {
  cursor: "pointer",
  borderColor: "transparent",
  paddingLeft: "5px",
  backgroundColor: "white",
  width: "100%"
};

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: { lat: 40.416775, lng: -3.70379 },
      currentPosition: {},
      isSidebarDisplayed: false,
    };
    this.openNav = this.openNav.bind(this);
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
          this.setState({ currentPosition: currentPosition });
        },
        err => console.error(err)
      );
    } else {
      console.error("Geolocation not supported");
    }
  }

  onMapClicked() {

  }

  openNav() {
    this.setState({ isSidebarDisplayed: !this.state.isSidebarDisplayed });
  }

  render() {
    return (
      <>
        <Map
          google = {this.props.google}
          zoom = {8}
          style = {mapStyle}
          initialCenter = {this.state.initialPosition}
          center = {this.state.currentPosition !== {} ? this.state.currentPosition : null}
          onClick = {this.onMapClicked}
        />
        <div className="arrowNav" style={arrowNav}>
          {this.state.isSidebarDisplayed ? <Sidebar /> : null}
          <button onClick={this.openNav} style={btnStyle}>
            <img
              alt="right-chevron"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTguNjI5IDE1Ljk5N2wtNy4wODMtNy4wODFMMTMuNDYyIDdsOC45OTcgOC45OTdMMTMuNDU3IDI1bC0xLjkxNi0xLjkxNnoiLz48L3N2Zz4="
            />
          </button>
        </div>
      </>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "",
})(MainContainer);


// var mapOptions = {
//   zoom: 13,
//   mapTypeId: "roadmap",
//   mapTypeControl: false,
//   styles: [{
//     "featureType": "poi.attraction",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "poi.business",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "poi.government",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "poi.medical",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "poi.medical",
//     "elementType": "geometry",
//     "stylers": [{
//       "visibility": "on"
//     }]
//   },
//   {
//     "featureType": "poi.park",
//     "stylers": [{
//       "visibility": "on"
//     }]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "geometry.fill",
//     "stylers": [{
//       "visibility": "on"
//     }]
//   },
//   {
//     "featureType": "poi.place_of_worship",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "poi.school",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "poi.sports_complex",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "transit.line",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "transit.station",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "transit.station.airport",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "transit.station.bus",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   },
//   {
//     "featureType": "transit.station.rail",
//     "stylers": [{
//       "visibility": "off"
//     }]
//   }
//   ]
// };

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
