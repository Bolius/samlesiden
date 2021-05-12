import React from "react";
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