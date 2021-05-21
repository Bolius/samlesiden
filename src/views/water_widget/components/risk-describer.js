import React from "react";
import RiskDB from "../risks.json";

import Risk from "./risk.js";

export default function RiskDescriber(props) {
  const image = require(`../assets/gauges/risk-${props.threatLevel}.png`);
  const hacky_threat_nr = // Update Css to avoid this
    ["low", "medium", "high"].indexOf(props.threatLevel) + 2;

  // If returning module with default param => use default param
  const imageUse = ("object" === typeof(image) && "undefined" !== typeof(image.default)) ? image.default : image;  

  const riskImage = (
    <div className="water-comes-app-estimate">
      <img src={imageUse} className="img-fluid" alt="Risiko måler" />
      <p className={`risc-${hacky_threat_nr}`}>
        {getRiskText(props.threatLevel)}
      </p>
    </div>
  );
  return (
    <div className="water-comes-app-hightlighted">
      {riskImage}

      <div className="water-comes-app-explanation">
        <h3>Faktorer, der påvirker boligens risiko ved {props.floodType}</h3>
        <div className="risk-list">
          {constructRisks(props.risks, props.logClick, props)}

          {props.floodType === "skybrud" ? (
            <Risk
              title={RiskDB["rain_other"].title}
              description={RiskDB["rain_other"].description}
              threatLevel={"medium"}
              logClick={() => props.logClick(RiskDB["rain_other"].title)}
              toggleTracker={props.toggleTracker}
            />
          ) : (
            <Risk
              title={RiskDB["flood_other"].title}
              description={RiskDB["flood_other"].description}
              threatLevel={"medium"}
              logClick={() => props.logClick(RiskDB["flood_other"].title)}
              toggleTracker={props.toggleTracker}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function getRiskText(threatLevel) {
  switch (threatLevel) {
    case "high":
      return "Høj risiko";
    case "medium":
      return "Mellem risiko";
    case "low":
      return "Lav risiko";
    default:
      throw new `Invalid threatlevel: ${threatLevel}`();
  }
}

function constructRisks(risks, logClick, props) {
  const risk_types = Object.keys(risks);
  const ordered_risks = ["high", "medium", "low"]
    .map(level =>
      risk_types.filter(risk_type => risks[risk_type].risk === level)
    )
    .reduce((acc, val) => acc.concat(val), [])
    .map(key => ({ name: key, data: risks[key] }));
  return ordered_risks.map((threat, i) => (
    <Risk
      key={i}
      logClick={(title) => logClick(title)}
      threatLevel={threat.data.risk}
      title={RiskDB[threat.name][threat.data.risk]}
      description={RiskDB[threat.name].description}
      readMore={RiskDB[threat.name].link}
      map={formatImage(threat.data.image)}
      toggleTracker={props.toggleTracker}
    />
  ));
}

function formatImage(image) {
  if (image !== undefined) {
    image = image.substring(2, image.length - 1);
    image = `data:image/png;base64,${image}`;
  }
  return image;
}
