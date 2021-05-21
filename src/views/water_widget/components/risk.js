import React, { useState } from "react";
import { Row, Col } from "reactstrap";
export default function Risk(props) {
  // Keep track of toggle state of risk factors in prop toggleTracker
  const currentlyShown =
    props.toggleTracker[props.title] === undefined
      ? false
      : props.toggleTracker[props.title];
  const [showDescription, setShowDescription] = useState(currentlyShown);

  // If toggle state for same index is different from tracked state because of toggle in
  // another tab set the toggle status to the one tracked
  if (props.toggleTracker[props.title] === undefined) {
    props.toggleTracker[props.title] = currentlyShown;
  }
  if (showDescription !== props.toggleTracker[props.title]) {
    setShowDescription(props.toggleTracker[props.title]);
  }

  const toggleDescription = () => {
    props.logClick(props.title);

    // Use the toggleTracker state instead of using showDescription directly
    props.toggleTracker[props.title] = !props.toggleTracker[props.title];
    setShowDescription(props.toggleTracker[props.title]);
  };

  const header = (
    <header onClick={toggleDescription}>
      {threatImage(props.threatLevel)}
      <h4>{props.title}</h4>
      {showDescription ? (
        <i className="icon-remove-24">remove</i>
      ) : (
        <i className="icon-add-24">add</i>
      )}
    </header>
  );

  if(props.readMore && props.threatLevel === "high"){
    var readMore = (
      
      <p className="inline-links-in-article" onClick={() => props.logClick(props.readMore.title)}>
        <a 
          href={props.readMore.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="category orange">Læs mere: </span>
          {props.readMore.title}
        </a>
      </p>
    );
  }
  
  const description = (
    <div>
      {renderText(props.description)}
      {renderMap(props.map)}
      {props.readMore ? readMore : ""}
    </div>
  );


  return (
    <div className="water-comes-app-risk">
      {header}
      <Row>
        <Col>
          <div className="description">
            {showDescription ? description : ""}
          </div>
        </Col>
      </Row>
    </div>
  );
}

function renderMap(map) {
  if (map !== undefined) {
    return (
      <div className="map-wrapper">
        <img src={map} alt="map" />
      </div>
    );
  }
}

function threatImage(threatLevel) {
  switch (threatLevel) {
    case "high":
      return <span className="danger icon-high-risc">high risc</span>;
    case "medium":
      return <span className="danger icon-change_history-24">medium risc</span>;
    case "low":
      return <span className="danger icon-low-risc">low risc</span>;
    default:
      throw new `Invalid threatLevel: ${threatLevel}`();
  }
}

function renderText(text) {
  return text
    .split("\n")
    .map((t, i) => <p key={i} dangerouslySetInnerHTML={{ __html: t }} />);
}
