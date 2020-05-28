import React, { Component } from "react";
import axios from "axios";

import './sidebar.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handleNewMarker = this.handleNewMarker.bind(this);
    this.generateRoute = this.generateRoute.bind(this);
  }

  componentDidMount() {
    this.autocomplete = new this.props.googleprops.maps.places.Autocomplete(this.autocompleteInput.current, { "types": ["geocode"] });
  }

  handleNewMarker(e) {
    const place = this.autocomplete.getPlace();
    this.props.handleNewMarker(place);
  }

  generateRoute() {
    var service = new this.props.googleprops.maps.DistanceMatrixService();
    const markersPos = this.props.markers.map(x => x.position)

    service.getDistanceMatrix(
      {
        origins: markersPos,
        destinations: markersPos,
        travelMode: 'DRIVING'
      }, responseDistanceMatrix);

    function responseDistanceMatrix(response, status) {
      if (status === "OK") {
        var matrix = response.rows.map(row => {
          return row.elements.map(element => {
            return element.distance.text;
          });
        });
        matrix.unshift(response.originAddresses)
        console.log(matrix)
        callCloudFunction();
        function callCloudFunction() {
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
              const data = response.data;
              console.log(data);
            }
          });
        }
      }
    }
  }


  render() {
    var markersArr = this.props.markers;
    if (markersArr.length >= 2) {
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
            <h3>Lista de marcadores</h3>
            <ul>
              {markersArr !== undefined && markersArr.length !== 0
                ? markersArr.map((marker, i) => {
                  return <li onClick={(e) => { this.props.handlerSetMapCenter(marker.position) }} key={i}>{marker.formatted_address}</li>
                })
                : <li key="noDir">No hay ningún dirección cargada.</li>
              }
            </ul>
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
