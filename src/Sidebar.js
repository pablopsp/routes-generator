import React, {
    Component
} from 'react'

const navStyle = {
    position: "absolute",
    marginTop: "20px"
};

const btnStyle = {
    cursor: "pointer",
    backgroundColor: "transparent",
    borderColor: "transparent",
    paddingLeft: "10px"
}

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.openNav = this.openNav.bind(this);
    }
    componentDidMount() {

    }

    openNav() {
        alert("HOLA")
    }

    render() {
        return (<><nav className="topnav" style={navStyle}>
            <button href="#" onClick={this.openNav} style={btnStyle}>
                <img alt="right-chevron" src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTguNjI5IDE1Ljk5N2wtNy4wODMtNy4wODFMMTMuNDYyIDdsOC45OTcgOC45OTdMMTMuNDU3IDI1bC0xLjkxNi0xLjkxNnoiLz48L3N2Zz4=' />            </button>
        </nav></>
        );
    }
}

export default Sidebar;