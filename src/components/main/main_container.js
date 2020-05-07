import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
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
    };

    this.openNav = this.openNav.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
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

  handleMapClick(e) {

  }

  openNav() {
    this.setState({ isSidebarDisplayed: !this.state.isSidebarDisplayed });
  }

  render() {

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
          onContextMenu={this.handleMapClick}
        />

        {this.state.isSidebarDisplayed ? <Sidebar sidebarClass="sidebar" /> : <Sidebar sidebarClass="sidebarClosed" />}
        <button className={!this.state.isSidebarDisplayed ? "arrowBtn" : "arrowNavWithSideBar"} onClick={this.openNav}>
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
