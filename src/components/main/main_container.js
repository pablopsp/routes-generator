import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

import EventInfoWindow from "../infowindowhandler/info_window_handler"
import Sidebar from "../sidebar/sidebar";
import LoadingIndicator from "./../loading"

import starterMarker from '../../assets/iconfinder_Map-Marker-Ball-Azure_73012.png'
import defaultMarker from '../../assets/iconfinder_Map-Marker-Ball-Pink_73017.png'
import './main_container.css';
import mapOptions from '../../MapOptions';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: { lat: 40.416775, lng: -3.70379 },
      currentPosition: {},
      currentZoom: 6,

      isSidebarDisplayed: true,

      showingInfoWindow: false,
      infoWindowPosition: null,

      showingInfoMarker: false,
      infoMarkerPosition: null,

      markers: [],
      markerPlaceName: ""
    };

    this.mapRef = React.createRef();

    this.toggleNav = this.toggleNav.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.deleteMarker = this.deleteMarker.bind(this);
    this.setMapCenter = this.setMapCenter.bind(this);
    this.onNewMarker = this.onNewMarker.bind(this);
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

  _mapLoaded(mapProps, map) {
    map.setOptions({
      styles: mapOptions
    });
  }

  toggleNav() {
    this.setState({ isSidebarDisplayed: !this.state.isSidebarDisplayed });
  }

  handleMapClick(t, map, coord) {
    this.setState({ showingInfoWindow: true });
    this.setState({ infoWindowPosition: coord.latLng });
  }


  reverseGeocoding(coords, func) {
    const geocoder = new this.props.google.maps.Geocoder();

    geocoder.geocode({ 'location': coords }, (results, status) => {
      if (status === "OK") {
        if (results[0])
          func(results[0].formatted_address);
        else
          console.log("No results found at reverse geocoding");
      }
      else
        console.error("Geocoder failed due to: " + status)
    });
  }


  addMarker(e) {
    const coords = this.state.infoWindowPosition;
    const type = e.target.value;

    this.reverseGeocoding(coords, (formatted_address) => {
      const newMarker = { type: type, position: coords, formatted_address: formatted_address };
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
    });
  }

  deleteMarker(index) {
    const markerToDelete = this.state.markers[index];
    const markerType = markerToDelete.type;

    this.state.markers.splice(index, 1);

    if (markerType === "starter" && this.state.markers.length !== 0) {
      const newStarter = this.state.markers.shift();
      this.state.markers.unshift({ type: "starter", position: newStarter.position, formatted_address: newStarter.formatted_address });
    }
    this.setState({ showingInfoMarker: false });
  }

  onMarkerClick(props, marker, e) {
    this.setState({ showingInfoMarker: true });
    this.setState({ markerPlaceName: marker.name });
    this.setState({ infoMarkerPosition: marker.internalPosition });
  }

  setMapCenter(position) {
    this.setState({ currentPosition: position });
  }

  onNewMarker(place) {
    const type = this.state.markers.length === 0 ? "starter" : "default";
    const newMarker = { type: type, position: place.geometry.location, formatted_address: place.formatted_address };
    this.state.markers.push(newMarker);

    this.setState({ showingInfoMarker: true });
    this.setState({ markerPlaceName: place.formatted_address });
    this.setState({ infoMarkerPosition: place.geometry.location });

  }

  render() {
    const _markers = this.state.markers;

    return (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <Map
          google={this.props.google}
          ref={this.mapRef}
          zoom={this.state.currentZoom}
          mapTypeControl={false}
          initialCenter={this.state.initialPosition}
          center={this.state.currentPosition !== {} ? this.state.currentPosition : ''}
          className={!this.state.isSidebarDisplayed ? "mapStyle" : "mapStyleWithSideBar"}
          onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
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
              name={marker.formatted_address}
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
              <p>{this.state.markerPlaceName}</p>
            </div>
          </EventInfoWindow>
        </Map>

        {this.state.isSidebarDisplayed
          ? <Sidebar
            googleprops={this.props.google}
            mapRef={this.mapRef}
            sidebarClass="sidebar"
            handleNewMarker={this.onNewMarker}
            handlerSetMapCenter={this.setMapCenter}
            markers={this.state.markers}
            handleDeleteMarker={this.deleteMarker}
          />
          : <Sidebar sidebarClass="sidebarClosed" />}
        <button className={!this.state.isSidebarDisplayed ? "arrowBtn" : "arrowNavWithSideBar"} onClick={this.toggleNav}>
          <img
            alt="right-chevron"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTguNjI5IDE1Ljk5N2wtNy4wODMtNy4wODFMMTMuNDYyIDdsOC45OTcgOC45OTdMMTMuNDU3IDI1bC0xLjkxNi0xLjkxNnoiLz48L3N2Zz4="
          />
        </button>
        <LoadingIndicator />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAPS_KEY,
})(MainContainer);
