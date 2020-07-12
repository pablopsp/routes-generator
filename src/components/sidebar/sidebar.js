import React, { Component } from "react";
import axios from "axios";

import './sidebar.css';
import firebase from './../../services/fire-service'
import nearestOnes from './../../algorithm/nearest-ones';
import clearMatrix from './../../utils';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoute: false,

      routeTotalDistance: 0,
      routesTotalDistanceNearestOnes: 0,
      routeIndications: []
    };
    this.autocompleteInput = React.createRef();

    this.autocomplete = null;
    this.matrixService = null;
    this.directionsService = null;
    this.directionsRenderer = null;

    this.handleNewMarker = this.handleNewMarker.bind(this);
    this.generateRoute = this.generateRoute.bind(this);
    this.callCloudFunction = this.callCloudFunction.bind(this);
  }

  componentDidMount() {
    this.matrixService = new this.props.googleprops.maps.DistanceMatrixService();
    this.directionsService = new this.props.googleprops.maps.DirectionsService();
    this.directionsRenderer = new this.props.googleprops.maps.DirectionsRenderer({
      suppressMarkers: true,
      suppressInfoWindows: true
    });
    this.autocomplete = new this.props.googleprops.maps.places.Autocomplete(this.autocompleteInput.current, { "types": ["geocode"] });
  }

  handleNewMarker(e) {
    this.directionsRenderer.setMap(null);
    const place = this.autocomplete.getPlace();
    this.props.handleNewMarker(place);
  }

  generateRoute() {
    if (this.props.markers.length >= 3) {
      this.setState({ routeTotalDistance: 0, routeIndications: [] });

      const markersPos = this.props.markers.map(x => x.position)
      this.matrixService.getDistanceMatrix(
        {
          origins: markersPos,
          destinations: markersPos,
          travelMode: 'DRIVING'
        }, responseDistanceMatrix.bind(this));

      function responseDistanceMatrix(response, status) {
        if (status === "OK") {
          var matrix = response.rows.map(row => {
            return row.elements.map(element => {
              return element.distance.text;
            });
          });

          matrix = clearMatrix(matrix);
          const distanceNearestOnes = nearestOnes(matrix);
          matrix.unshift(response.originAddresses);
          this.callCloudFunction(response.originAddresses, matrix, distanceNearestOnes);
        }
      }
    }
    else
      alert("Necesita al menos 3 puntos o más para generar una ruta.");
  }


  callCloudFunction(addressArr, matrix, distanceNearestOnes) {
    axios({
      method: 'POST',
      url: process.env.REACT_APP_GPC_FUNCTION_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: JSON.stringify({ "matrix": JSON.stringify(matrix) })
    }).then((response) => {
      if (response && response.status === 200) {
        const dataObj = response.data;
        const dataArr = dataObj['camino'];
        const distance = dataObj['distance'];

        const routeArr = dataArr.map(n => addressArr[n]);
        const origin = routeArr.shift()
        const destination = routeArr.pop()

        var waypts = routeArr.map(point => {
          return { location: point, stopover: true }
        });

        this.directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, (response, status) => {
          if (status === 'OK') {
            this.directionsRenderer.setMap(this.props.mapRef['current']['map']);
            this.directionsRenderer.setDirections(response);
            const route = response.routes[0];
            const routeCustomObject = route['legs'].map(leg => {
              return { from: leg['start_address'], to: leg['end_address'], steps: leg['steps'] };
            });
            this.state.routeIndications.push(routeCustomObject);
            this.setState({
              routeTotalDistance: distance,
              showRoute: true,
              routesTotalDistanceNearestOnes: distanceNearestOnes.reduce((acc, x) => acc + x)
            });

            firebase.firestore().collection("route-data").add({
              "origin": response['request']['origin']['query'],
              "waypoints": response['request']['waypoints'].map(waypoint => waypoint.location['query']),
              "legs": response.routes[0]['legs'].map(leg => {
                return { from: leg['start_address'], to: leg['end_address'], distance: leg['distance'], duration: leg['duration'] };
              })
            });

          }
          else
            console.error('Directions request failed due to ' + status);
        });
      }
    });
  }


  render() {
    var markersArr = this.props.markers;
    if (markersArr !== undefined && markersArr.length >= 2) {
      const marker = markersArr.filter(marker => { return marker.type === "starter" });
      markersArr.splice(0, 0, markersArr.splice(markersArr.indexOf(marker[0]), 1)[0]);
    }

    return (
      <nav className={this.props.sidebarClass}>
        <div className="info-container">
          <div className="places-container">
            <h3>Agregue direcciones</h3>
            <input ref={this.autocompleteInput} id="autocomplete" placeholder="Ingrese su dirección" type="text"></input>
            <button id="searchBtn" type="submit" onClick={this.handleNewMarker}><i className="fa fa-search"></i></button>
          </div>
          <hr />
          <div className="markers-container">
            <div className="switcher-markers-routes">
              <button onClick={(e) => { this.setState({ showRoute: !this.state.showRoute }) }}>Markers</button>
              <button onClick={(e) => { this.setState({ showRoute: !this.state.showRoute }) }}>Routes</button>
            </div>
            {this.state.showRoute ? <h3>Rutas e indicaciones</h3> : <h3>Lista de marcadores</h3>}
            {this.state.showRoute
              ?
              <ul style={{ textAlign: "left", listStyleType: "circle" }} className="routeIndications">
                {this.state.routeIndications.length !== 0 ?
                  <div>
                    <h4 style={{ color: "#f59622" }}>Distancia total nearest: {this.state.routesTotalDistanceNearestOnes} km.</h4>
                    <h4 style={{ color: "#07c" }}>Distancia total ants: {this.state.routeTotalDistance} km.</h4>
                    <h4>Ruta</h4>
                    {this.state.routeIndications[0].map((indication, i) => {
                      return <div style={{ marginLeft: "8%" }} key={i * this.state.routeTotalDistance}>
                        <span><b>From: </b>{indication['from']}</span>
                        <br />
                        <span><b>To: </b> {indication['to']}</span>
                        <br /><br />
                      </div>
                    })}
                    <h4>Indicaciones</h4>
                    {this.state.routeIndications[0].map((indication, i) => {
                      return <div key={i * (this.state.routeTotalDistance / 2)}>
                        <span><b>Pasos de la ruta</b></span>
                        <br />
                        {indication['steps'].map(step => {
                          return <li style={{ marginLeft: "8%" }} key={step['distance'].value * step['duration'].value}
                            dangerouslySetInnerHTML={{ __html: step['instructions'] }}></li>;
                        })}

                        {i !== 0 || i !== this.state.routeIndications.length ? <hr style={{ marginLeft: "0" }} /> : null}
                      </div>
                    })}
                  </div>
                  : <h4 style={{ textAlign: "center" }}>No Hay rutas</h4>}
              </ul>
              :
              <ul>
                {markersArr !== undefined && markersArr.length !== 0
                  ? markersArr.map((marker, i) => {
                    return <li onClick={(e) => { this.props.handlerSetMapCenter(marker.position) }} key={i}>
                      {marker.formatted_address}
                      <i onClick={(e) => { this.directionsRenderer.setMap(null); this.props.handleDeleteMarker(i); }} className="fa fa-window-close"></i>
                    </li>
                  })
                  : <li key="noDir">No hay ningún dirección cargada.</li>
                }
              </ul>}
          </div>
          <hr />
          <div className="generate-route-container">
            <button className="btnGenerateRoute" onClick={this.generateRoute}>Generar ruta</button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Sidebar;
