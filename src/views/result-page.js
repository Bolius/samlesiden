import React from "react";

import KommuneIndbrud from './KommuneIndbrud'
import Grundskyld from './KommuneGrundskyld'
import KommuneBoligpriser from './KommuneBoligpriser'

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
                  showHeader={this.props.showHeader}
                  graphType={this.props.graphType} />;
      case "Grundskyld":
        console.log("Grundskyld er valgt fra resultpage")
        return <Grundskyld 
                  komKode={this.props.area} 
                  time={this.props.time}
                  showHeader={this.props.showHeader}
                  graphType={this.props.graphType} />;
      case "Boligpriser":
        console.log("Boligpriser er valgt fra resultpage")
        return <KommuneBoligpriser 
                  komKode={this.props.area} 
                  time={this.props.time}
                  showHeader={this.props.showHeader}
                  graphType={this.props.graphType} />;
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