import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import EventInfoWindow from "../infowindowhandler/info_window_handler"
import Sidebar from "../sidebar/sidebar";

import './main_container.css';

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialPosition: { lat: 40.416775, lng: -3.70379 },
      currentPosition: {},
      currentZoom: 6,
      isSidebarDisplayed: false,
      showingInfoWindow: false,
      infoWindowPosition: null,
      markers: []
    };

    this.toggleNav = this.toggleNav.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.setState({ currentPosition: currentPosition });
          this.setState({ currentZoom: 11 });
        },
        err => console.error(err)
      );
    } else {
      console.error("Geolocation not supported");
    }
  }

  // _mapLoaded(mapProps, map) {
  //   map.setOptions({
  //     styles: mapOpt
  //   });
  // }

  handleMapClick(t, map, coord) {
    this.setState({ showingInfoWindow: true });
    this.setState({ infoWindowPosition: coord.latLng });
  }

  toggleNav() {
    this.setState({ isSidebarDisplayed: !this.state.isSidebarDisplayed });
  }

  addMarker(e) {
    const coords = this.state.infoWindowPosition;
    const type = e.target.value;

    const newMarker = {type: type, position: coords}
    type === "starter" ? this.state.markers.unshift(newMarker) : this.state.markers.push(newMarker);
    this.setState({showingInfoWindow: false});
  }

  onMarkerClick(props, marker, e) {

  }

  render() {
    const _markers = this.state.markers;
    return (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <Map
          google={this.props.google}
          zoom={this.state.currentZoom}
          initialCenter={this.state.initialPosition}
          center={this.state.currentPosition !== {} ? this.state.currentPosition : ''}
          className={!this.state.isSidebarDisplayed ? "mapStyle" : "mapStyleWithSideBar"}
          //para que funcione el onready de custom style hace falta key
          //onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
          onClick={this.handleMapClick}
          onContextMenu={this.handleMapClick}>

          <EventInfoWindow
            visible={this.state.showingInfoWindow}
            position={this.state.infoWindowPosition}
          >
            <div id="infoWindowContainer">
              <button value="default" className="infoWindowButton" onClick={this.addMarker}>Añadir nuevo punto</button>
              <button value="starter" className="infoWindowButton" onClick={this.addMarker}>Añadir nuevo punto de inicio</button>
            </div>
          </EventInfoWindow>
          
          {_markers.map((marker, i) => {
            return <Marker
              key={marker.type+i}
              onClick={this.onMarkerClick}
              position={marker.position}
            />
          })}
        </Map>

        {this.state.isSidebarDisplayed ? <Sidebar sidebarClass="sidebar" /> : <Sidebar sidebarClass="sidebarClosed" />}
        <button className={!this.state.isSidebarDisplayed ? "arrowBtn" : "arrowNavWithSideBar"} onClick={this.toggleNav}>
          <img
            alt="right-chevron"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTguNjI5IDE1Ljk5N2wtNy4wODMtNy4wODFMMTMuNDYyIDdsOC45OTcgOC45OTdMMTMuNDU3IDI1bC0xLjkxNi0xLjkxNnoiLz48L3N2Zz4="
          />
        </button>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "",
})(MainContainer);

/*
  map infowindow on click
  que salgas dos opciones, agregar nuevo punto
  o agregar nuevo inicio

  al darle a agregar nuevo punto, this.state.markers.push()
  al darle a agregar nuevo inicio, this.state.markers.push() al inicio del array

  y para mostrar los markers en el map, this.state.markers.map en el return render
*/

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
