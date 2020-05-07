import React, { Component } from "react";


import './sidebar.css';

class Sidebar extends Component {
  render() {
    return (
      <div className={this.props.sidebarClass}>
        <div className="info-container">
          <p>Holiwis</p>
        </div>
      </div>
    );
  }
}

export default Sidebar;
