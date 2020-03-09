import React, {
  Component
} from 'react'

const mapStyle = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  height: '100%'
};

class GoogleMap extends Component {
  componentDidMount() {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -33.8688,
        lng: 151.2195
      },
      zoom: 13,
      mapTypeId: 'roadmap',
    });
  }

  render() {
    return ( <
      div id = 'map'
      style = {
        mapStyle
      }
      /> 
    );
  }
}

export default GoogleMap;