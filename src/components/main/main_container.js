import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

import EventInfoWindow from "../infowindowhandler/info_window_handler"
import Sidebar from "../sidebar/sidebar";

import starterMarker from '../../assets/iconfinder_Map-Marker-Ball-Azure_73012.png'
import defaultMarker from '../../assets/iconfinder_Map-Marker-Ball-Pink_73017.png'
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

      showingInfoMarker: false,
      infoMarkerPosition: null,

      markers: []
    };

    this.toggleNav = this.toggleNav.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.deleteMarker = this.deleteMarker.bind(this);
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

  toggleNav() {
    this.setState({ isSidebarDisplayed: !this.state.isSidebarDisplayed });
  }

  handleMapClick(t, map, coord) {
    this.setState({ showingInfoWindow: true });
    this.setState({ infoWindowPosition: coord.latLng });
  }

  addMarker(e) {
    const coords = this.state.infoWindowPosition;
    const type = e.target.value;

    const newMarker = { type: type, position: coords };
    const existsStarter = this.state.markers.filter(marker => { return marker.type === "starter" });

    if (type === "starter" && existsStarter[0] !== undefined) {
      if (window.confirm("Ya existe un punto de incio, ¿desea cambiarlo y borrar el actual?")) {
        this.state.markers.shift();
        this.state.markers.unshift(newMarker);
      }
    }
    else if (type === "starter" && existsStarter === undefined)
      this.state.markers.unshift(newMarker);
    else
      this.state.markers.push(newMarker);

    this.setState({ showingInfoWindow: false });
  }

  deleteMarker(e) {
    const markerCoords = this.state.infoMarkerPosition;
    const markerToDelete = this.state.markers.filter(marker => { return marker.position === markerCoords });
    const markerType = markerToDelete[0].type;
    const index = this.state.markers.indexOf(markerToDelete[0])

    this.state.markers.splice(index, 1);
    if (markerType === "starter") {
      const newStarter = this.state.markers.shift();
      this.state.markers.unshift({ type: "starter", position: newStarter.position });
    }

    this.setState({ showingInfoMarker: false });
  }

  onMarkerClick(props, marker, e) {
    this.setState({ showingInfoMarker: true });
    this.setState({ infoMarkerPosition: marker.internalPosition });
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
            onClose={() => { this.setState({ showingInfoWindow: false }) }}
          >
            <div id="infoWindowContainer">
              <button value="default" className="infoWindowButton" onClick={this.addMarker}>Añadir nuevo punto</button>
              <button value="starter" className="infoWindowButton" onClick={this.addMarker}>Añadir nuevo punto de inicio</button>
            </div>
          </EventInfoWindow>

          {_markers.map((marker, i) => {
            return <Marker
              key={marker.type + i}
              onClick={this.onMarkerClick}
              position={marker.position}
              icon={{
                url: marker.type === "starter" ? starterMarker : defaultMarker,
                scaledSize: new this.props.google.maps.Size(30, 30)
              }}
            />
          })}

          <EventInfoWindow
            visible={this.state.showingInfoMarker}
            position={this.state.infoMarkerPosition}
            onClose={() => { this.setState({ showingInfoMarker: false }) }}
          >
            <div id="infoWindowContainer">
              <button className="infoWindowButton" onClick={this.deleteMarker}>Eliminar punto</button>
            </div>
          </EventInfoWindow>
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
  apiKey: process.env.REACT_APP_MAPS_KEY,
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
