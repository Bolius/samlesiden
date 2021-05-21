import React from "react";
import { Row, Col, Button } from "reactstrap";
import ApartmentBox from "./apartment-box.js";

export default class MapBox extends React.Component {
  render() {
    const mapParams = {
      center: this.props.address,
      zoom: 18,
      size: "600x338",
      maptype: "hybrid",
      markers: `color:0x58B1DD|location:${this.props.address}`,
      key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
      scale: 1,
      language: "danish",
      region: "dk"
    };
    let mapUrl = "https://maps.googleapis.com/maps/api/staticmap?";
    for (let [key, value] of Object.entries(mapParams)) {
      mapUrl += `${key}=${encodeURI(value)}&`;
    }
    mapUrl = mapUrl.substring(0, mapUrl.length - 1);
    return (
      <div className="water-comes-app-resume">
        <h2>Risikovurdering af din bolig</h2>
        <Row>
          <Col sm={{ size: "6" }}>
            <img src={mapUrl} alt="Bolig Kort" className="map-image" />
            <address>{this.props.address}</address>
            <Button color="link" onClick={this.props.reset}>
              Skift adresse
            </Button>
          </Col>
          <Col sm={{ size: "6" }}>
            {this.props.isApartment ? <ApartmentBox /> : ""}
            <p>
              Nedenfor kan du få et indtryk af, hvor udsat din bolig er ved
              oversvømmelse, når vandet kommer udefra. Du kan også få gode råd
              til, hvordan du bedst forebygger oversvømmelse i fremtiden.
            </p>
            <p>
              Vær opmærksom på, at resultatet er vejledende og kan være behæftet
              med usikkerheder.{" "}
              <button className="btn btn-link" onClick={this.props.showModal}>
                Læs mere om datagrundlaget her.
              </button>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}
