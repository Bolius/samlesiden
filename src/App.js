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
import KommuneIndbrud from './views/KommuneIndbrud.js';

function User() {
  let { id } = useParams();

  return id;
}

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
                <AdressSelect
                  toggleDataModal={this.toggleDataModal}
                  setData={this.setData}
                />
              ) : (
                <ResultPage
                  toggleDataModal={this.toggleDataModal}
                  komKode={this.state.komKode}
                  reset={this.reset}
                />
              )}
            </Route>
            <Switch>
              <Route path="/indbrud/:area/:time/:showHeader" children={<ShowGraph1 />} />
              <Route path="/boligpriser/:area/:time/:showHeader" children={<ShowGraph2 />} />
            </Switch>
          </Switch>
        </Router>
      </div>
    );
  }
}

function ShowGraph1() {
  let { area, time, showHeader } = useParams();
  return (
    <ResultPage
      graph="AnmSigtKom"
      area={area}
      time={time}
      showHeader={showHeader}
      reset={App.reset}
    />
  )
}

function ShowGraph2() {
  let { area, time, showHeader } = useParams();
  return (
    <ResultPage
      graph="Boligpriser"
      area={area}
      time={time}
      showHeader={showHeader}
      reset={App.reset}
    />
  )
}
export default App;
