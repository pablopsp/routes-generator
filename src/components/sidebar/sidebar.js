import React, { Component } from "react";

import './sidebar.css';

class Sidebar extends Component {

  render() {
    const markers = this.props.markers;
    
    return (
      <div className={this.props.sidebarClass}>
        <div className="info-container">
          <div className="markerList">
            <ul>
              {markers !== undefined && markers.length !== 0
                ? markers.map((marker, i) => {
                  return <li onClick={(e) => {this.props.handler(marker.position)}} key={i}>{marker.formatted_address}</li>
                })
                : <li key="noDir">No hay ningún dirección cargada.</li>
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
