import React, { Component } from "react";


import './sidebar.css';

class Sidebar extends Component {  
  render() {
    return (
      <div className={this.props.sidebarClass}>
        <p>Holiwis</p>
      </div>
    );
  }
}

export default Sidebar;
