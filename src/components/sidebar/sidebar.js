import React, { Component } from "react";

import './sidebar.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount(){
    
  }


  render() {
    const markers = this.props.markers;
    // const asd =["No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada.","No hay ningún dirección cargada."]
    return (
      <nav className={this.props.sidebarClass}>
        <div className="info-container">
          <div className="places-container">
            <p>Places</p>
          </div>
          <hr />
          <div className="markers-container">
            <h3 style={{color:"#06C"}}>Lista de marcadores</h3>
            <ul>
              {markers !== undefined && markers.length !== 0
                ? markers.map((marker, i) => {
                  return <li onClick={(e) => { this.props.handler(marker.position) }} key={i}>{marker.formatted_address}</li>
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
