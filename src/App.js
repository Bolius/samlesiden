import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ResultPage from "./views/result-page.js";
import AdressSelect from "./components/adress-select.js";
import "./index.css";
import Tabs from "./components/Tabs.js"; 

import KommuneIndbrud from "./views/KommuneIndbrud";


import { useParams } from "react-router";
import trackEvent from "./components/action-logger.js";

import KommuneSelector from "./components/KommuneSelector.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setKomKode = this.setKomKode.bind(this);
    this.state = {
      komKode: "101",
      komNavn: "København",
      hasKomData: "false",
    };
  }


  setKomKode = (kode) => {
    this.setState({
      hasKomData: true,
      komKode: kode
    });
  }

  setAdress = (add) => {
    this.setState({
      hasAddress: true,
      address: add
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

  toggleChildMenu = (k) => {
    this.setState({komKode: k});
  }


  reset() {
    this.setState({
      komKode: {},
      hasKomData: false
    });
  }

  render() {
    return (
      <div>
        <p> {this.state.message} </p>
        <Router>
          <Switch>
            <Route exact path="/">
              <>
                <h1>Samlesiden</h1>
                <KommuneSelector action={this.setKomKode} />
                <AdressSelect
                  toggleDataModal={this.toggleDataModal}
                  setAdress={this.setKomKode}
                  />
                <p>Valgt kommunekode: {this.state.komKode}</p>
              </>
              <Tabs>

                <div label="Kommunebaseret data"> 
                  <h3>Indbrud og sigtelser i kommunen</h3>
                  <KommuneIndbrud
                        komKode={this.state.komKode} 
                        time={"*"}
                        showHeader={"false"}
                        graphType={"spline"} />
                  
                </div> 
                <div label="Adressebaseret data"> 
                  Vandet kommer, mm.
                </div> 
                <div label="Grafkonfigurator"> 
                  <h3>emne/kommunekode/tid/visOverskrift/graftype</h3>   
                  <table>
                    <tr>
                      <th>Emne</th>
                      <th>Kommunekode</th>
                      <th>Tid</th>
                      <th>Vis overskrift</th>
                      <th>Graftype</th>
                    </tr>
                    <tr>
                      <td>indbrud</td>
                      <td>123</td>
                      <td>Uden kvartal</td>
                      <td>true | false</td>
                      <td>graftype</td>
                    </tr>
                    <tr>
                      <td>boligpriser</td>
                      <td>123</td>
                      <td>Med kvartal</td>
                      <td>true | false</td>
                      <td>graftype</td>
                    </tr>
                    <tr>
                      <td>grundskyld</td>
                      <td>123</td>
                      <td>Med kvartal</td>
                      <td>true | false</td>
                      <td>graftype</td>
                    </tr>
                  </table>
                  <br />
                  <table>
                    <tr>
                      <th>Attibute</th>
                      <th>Values</th>
                    </tr>
                    <tr>
                      <td>Tid med kvartal</td>
                      <td>* | {'>'}=2010K2 | {'<'}=2020K4 | == 2015K2 </td>
                    </tr>
                    <tr>
                      <td>Tid uden kvartal</td>
                      <td>* | {'>'}=2010 | {'<'}=2020 | == 2015 </td>
                    </tr>
                    <tr>
                      <td>Graftype</td>
                      <td>line | spline | stepLine | bars | area | splineArea | stepArea | waterfall | column | scatter | bubble</td>
                    </tr>
                  </table> 
                </div> 
              </Tabs>
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
