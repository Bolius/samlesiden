import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ResultPage from "./views/result-page.js";
import AdressSelect from "./components/adress-select.js";

import { useParams } from "react-router";
import trackEvent from "./components/action-logger.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setData = this.setData.bind(this);
    this.state = {
      showTotalIndbrud: false,
      showKommuneSelector: false,
      message: ""
    };
    
    this.handleToggleIndbrudTotal = this.handleToggleIndbrudTotal.bind(this);
    this.handleToggleKommunerSelector = this.handleToggleKommunerSelector.bind(this);
  }

  setData(komKode) {
    this.setState({
      hasData: true,
      komKode: komKode
    });
  }

  toggleDataModal() {
    if (!this.state.showModal) {
      if (!this.state.hasData) {
        trackEvent({
          description: `Datagrundlag`,
          eventLabel: `Side: adresseindtastning`,
        });
      } else {
        trackEvent({
          description: `Datagrundlag`,
          eventLabel: `Side: resultatside`,
        });
      }
    }
    this.setState({
      showModal: !this.state.showModal
    });
  }

  reset() {
    this.setState({
      komKode: {},
      hasData: false
    });
  }

  handleToggleIndbrudTotal() {
    this.setState(state => ({
      showTotalIndbrud: !state.showTotalIndbrud
    }));
  }

  handleToggleKommunerSelector() {
    this.setState(state => ({
      showKommuneSelector: !state.showKommuneSelector
    }));
  }


  render() {
    return (
      <div>
        
        <p> {this.state.message} </p>
        <Router>
          <Switch>
            <Route exact path="/">
              {!this.state.hasData ? (
                <>
                <AdressSelect
                  toggleDataModal={this.toggleDataModal}
                  setData={this.setData}
                />
                <ul>
                  <li>/indbrud/:area/:time/:showHeader/:graphType</li>
                  <li>/boligpriser/:area/:time/:showHeader/:graphType</li>
                </ul>
                </>
              ) : (
                <ResultPage
                  toggleDataModal={this.toggleDataModal}
                  komKode={this.state.komKode}
                  reset={this.reset}
                />
              )}
            </Route>
            <Switch>
              <Route path="/indbrud/:area/:time/:showHeader/:graphType" children={<ShowGraph1 graph={"AnmSigtKom"}/>} />
              <Route path="/boligpriser/:area/:time/:showHeader/:graphType" children={<ShowGraph1 graph={"Boligpriser"}/>} />
              <Route path="/grundskyld/:area/:time/:showHeader/:graphType" children={<ShowGraph1 graph={"Grundskyld"}/>} />
            </Switch>
          </Switch>
        </Router>
      </div>
    );
  }
}

function ShowGraph1(props) {
  let { area, time, showHeader, graphType } = useParams();
  return (
    <ResultPage
      graph={props.graph}
      area={area}
      time={time}
      graphType={graphType}
      showHeader={showHeader}
      reset={App.reset}
    />
  )
}

export default App;
