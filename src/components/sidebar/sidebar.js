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
              {markers
                ? markers.map((marker, i) => {
                  return <li key={i}>{marker.formatted_address}</li>
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
