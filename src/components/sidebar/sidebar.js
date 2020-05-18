import React, { Component } from "react";

import './sidebar.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handleNewMarker = this.handleNewMarker.bind(this);
  }

  componentDidMount() {
    this.autocomplete = new this.props.googleprops.maps.places.Autocomplete(this.autocompleteInput.current,
      { "types": ["geocode"] });
  }

  handleNewMarker(e) {
    const place = this.autocomplete.getPlace();
    this.props.handleNewMarker(place);
  }

  render() {
    const markers = this.props.markers;
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
              {markers !== undefined && markers.length !== 0
                ? markers.map((marker, i) => {
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
