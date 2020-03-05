import React, { Component, createRef } from 'react'

class GoogleMap extends Component {
  constructor(props){
    super(props);
    this.googleMapRef = createRef();

  }

  componentDidMount() {
    const googleMapScript = document.createElement('script')
    googleMapScript .src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`
    window.document.body.appendChild(googleMapScript)

    googleMapScript.addEventListener('load', () => {
      this.googleMap = this.createGoogleMap()
      this.marker = this.createMarker()
    })
  }

  createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 16,
      center: {
        lat: 43.642567,
        lng: -79.387054,
      },
      disableDefaultUI: true,
    })

  createMarker = () =>
    new window.google.maps.Marker({
      position: { lat: 43.642567, lng: -79.387054 },
      map: this.googleMap,
    })

  render() {
    return (
      <GoogleMap
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}