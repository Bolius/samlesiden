import React from "react";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

import KommuneIndbrud from './KommuneIndbrud'
import Grundskyld from './KommuneGrundskyld'
import KommuneBoligpriser from './KommuneBoligpriser'
import AutoGraph from './auto-graph'

export default class ResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  renderSwitch(param) {
    switch(param) {
      case "AnmSigtKom":
        console.log("Inbrud er valgt fra resultpage")
        return <KommuneIndbrud 
                  komKode={this.props.area} 
                  time={this.props.time}
                  showHeader={this.props.showHeader} />;
        case "Boligpriser":
        console.log("Boligpriser er valgt fra resultpage")
        return <KommuneBoligpriser 
                  komKode={this.props.area} 
                  time={this.props.time}
                  showHeader={this.props.showHeader} />;
      default:
        return "";
    }
  }

  render() {
    return (
      <div>
        {this.renderSwitch(this.props.graph)}
      </div>
    );
  }
}
/*
<Router>
          <Link to={"kom/" + this.state.id}>{this.state.id}</Link>
        </Router>
*/