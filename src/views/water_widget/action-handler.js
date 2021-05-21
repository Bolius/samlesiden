import React from "react";
import RiskDescriber from "./components/risk-describer.js";
import Resume from "./components/resume.js";
import trackEvent from "./data-handlers/action-logger.js";
export default class ActionHandler extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTracker = {};
    this.toggleTab = this.toggleTab.bind(this);
    this.logClick = this.logClick.bind(this);

    this.rain_risks = {};
    const rain_risks_names = [
      "basement",
      "conductivity",
      "hollowing",
      "fastning"
    ];
    for (var risk of rain_risks_names) {
      this.rain_risks[risk] = this.props.dangers.rain_risk.factors[risk];
    }
    this.state = {
      tab: "skybrud",
      threatLevel: this.props.dangers.rain_risk.risk,
      risks: this.rain_risks,
      updated: "skybrud-" + Date.now(),
      toggleTracker: this.toggleTracker
    };
  }
  logClick = title =>
    trackEvent({
      description: `Faneblad: ${this.state.tab}`,
      eventLabel: `Faktorer: ${title}`,
      cloudbirstDimension: this.props.dangers.rain_risk.risk,
      floodDimension: this.props.dangers.storm_flood.risk
    });

  toggleTab(state) {
    trackEvent({
      description: `Faneblad skift`,
      eventLabel: `skiftede til: ${state}`,
      cloudbirstDimension: this.props.dangers.rain_risk.risk,
      floodDimension: this.props.dangers.storm_flood.risk
    });
    this.setState({
      tab: state,
      threatLevel:
        state === "skybrud"
          ? this.props.dangers.rain_risk.risk
          : this.props.dangers.storm_flood.risk,
      risks:
        state === "skybrud"
          ? this.rain_risks
          : { storm_flood: { risk: this.props.dangers.storm_flood.risk } },
      updated: state + "-" + Date.now()
    });
  }

  render() {
    return (
      <div className="water-comes-app-tabs">
        <ul className="nav nav-tabs" style={{ cursor: "pointer" }}>
          <li className="nav-item" onClick={() => this.toggleTab("skybrud")}>
            <span
              className={
                "nav-link " + (this.state.tab === "skybrud" ? " active" : "")
              }
            >
              Skybrud
            </span>
          </li>
          <li className="nav-item" onClick={() => this.toggleTab("stormflod")}>
            <span
              className={
                "nav-link " + (this.state.tab === "stormflod" ? " active" : "")
              }
            >
              Stormflod
            </span>
          </li>
        </ul>
        <div className="water-comes-app-actions">
          <RiskDescriber
            threatLevel={this.state.threatLevel}
            floodType={this.state.tab}
            risks={this.state.risks}
            logClick={this.logClick}
            updated={this.state.updated}
            toggleTracker={this.toggleTracker}
          />
          <Resume
            threatLevel={this.state.threatLevel}
            floodType={this.state.tab}
            dangers={this.props.dangers}
          />
        </div>
      </div>
    );
  }
}
