import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useParams } from "react-router";

import "./index.css";
import Tabs from "./components/Tabs.js"; 

import AutoGrapher from "./views/auto-graph";

import AdressSelect from "./components/adress-select.js";
import KommuneSelector from "./components/KommuneSelector.js";

import LatestAddressList from "./components/latest-addresses.js"
import Grafkonfigurator from './components/Grafkonfigurator';

import WaterComesModule from "./views/water_widget/water-widget-main.js";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.setKomKode = this.setKomKode.bind(this);
    
    // State preparation
    var adds = localStorage.getItem("latestAdd") || []
    var koms = localStorage.getItem("latestKom") || []
    var bbrs = localStorage.getItem("latestBBR") || []
    var koder = localStorage.getItem("latestKoder") || []
    if (adds.length > 0){
      adds = adds.split(";")
      koms = koms.split(";") 
      bbrs = bbrs.split(";") 
      koder = koder.split(";") 
    }
    this.state = {
      latestAdd: adds,
      latestKom: koms,
      latestBBR: bbrs,
      latestKode: koder,

      komKode: localStorage.getItem('komKode') || '101',
      komNavn: localStorage.getItem('komNavn') || 'København',
      address: localStorage.getItem('address') || 'Jarmers Plads 2',
      hasAddress: (localStorage.getItem("latestAdd") != null),
      hasKomKode: (localStorage.getItem("latestKom") != null),
    };
  }

  // Custom toString for address arrays,
  // as addresses contains ",", .toString() could not be used
  stringify = (arr) => {
    const reducer = (accumulator, currentValue) => accumulator + ";" + String(currentValue);
    return arr.reduce(reducer);
  }

  // Updating kommuner and their kodes without address
  setKomKode = (kode,navn) => {
    this.setState({
      hasKomKode: true,
      hasAddress: false,
      komKode: kode,
      komNavn: navn
    });
    localStorage.setItem('komKode', kode);
    localStorage.setItem('komNavn', navn);
  }

  // Set the current address in state and updates the 
  // list of last visited addresses
  setAddress = (kode,kom, add, bbr) => {
    console.log("Set address:", kode,kom,add,bbr)
    // Update kommunekoder
    var koder = this.state.latestKode
    koder.unshift(String(kode))
    koder = [...new Set(koder)].slice(0,5)

    // Update kommunenavne
    var komNavne = this.state.latestKom
    komNavne.unshift(String(kom))
    komNavne = [...new Set(komNavne)].slice(0,5)
    
    // Update addresser
    var addresser = this.state.latestAdd
    addresser.unshift(add)
    addresser = [...new Set(addresser)].slice(0,5)

    // Update bbr
    var bbrs = this.state.latestBBR
    bbrs.unshift(bbr)
    bbrs = [...new Set(bbrs)].slice(0,5)

    this.setState({
      hasAddress: true,
      hasKomKode: true,
      latestKoder: koder,
      latestKom: komNavne,
      latestAdd: addresser,
      latestBBR: bbrs,
      komKode: kode
    })

    // All variables are stringified with custom method
    // to avoid future confusion
    localStorage.setItem('latestKoder', this.stringify(koder))
    localStorage.setItem('latestAdd', this.stringify(addresser));
    localStorage.setItem('latestBBR', this.stringify(bbrs));
    localStorage.setItem('latestKom', this.stringify(komNavne));
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <>
              <h1>Samlesiden</h1>
              <div id="address-fetch-field">
                <div>
                  <AdressSelect
                    toggleDataModal={this.toggleDataModal}
                    setAddress={this.setAddress}
                    setData={this.setData}
                    />
                </div>
                <div>
                  <KommuneSelector action={this.setKomKode} komKode={this.state.komKode}/>
                </div>
              </div>
              <div>
                <LatestAddressList 
                  addressList={this.state.latestAdd}
                  komList={this.state.latestKom}
                  kodeList={this.state.latestKode}
                  bbrList={this.state.latestBBR}
                  setAddress={this.setAddress} />
              </div>
              <div id="address-show-field">
                <h2>Viser data baseret på følgende oplysninger:</h2>
                <div>
                  {this.state.hasKomKode && <p>{this.state.komNavn}, Kommunekode: {this.state.komKode}</p>}
                  {this.state.hasAddress && <p>{this.state.latestAdd[0]}, Kommunekode: {this.state.latestKode[0]}</p>}
                </div>
              </div>
            </>
            <Tabs  lastActive={localStorage.getItem("lastTab") || "Kommunebaseret data" }>
              <div label="Kommunebaseret data">
                { this.state.hasKomKode ?
                  <>
                  <AutoGrapher
                    table={"STRAF22"}
                    komKode={this.state.komKode}
                    data={"indbrud_total"}
                    time={"*"}
                    showHeader={"true"}
                    graphType={"spline"}
                  />
                  <AutoGrapher
                    table={"EJDSK3"}
                    komKode={this.state.komKode}
                    data={"grundskyld"}
                    time={"*"}
                    showHeader={"true"}
                    graphType={"spline"}
                  />
                  </>
                  :
                  <p>Indtast adresse eller vælg fra kommuner eller seneste addresser.</p>
                }
              </div> 
              <div label="Vandet kommer">
                { this.state.hasAddress ?
                  <WaterComesModule
                    navn={this.state.address} 
                    houseData={this.state.houseData} 
                  />
                  :
                  <p>Indtast adresse eller vælg fra seneste addresser.</p>
                } 
              </div> 
              <div label="Grafkonfigurator"> 
                <Grafkonfigurator />
              </div> 
            </Tabs>
          {
          // If URL is given, generate the requested graph an nothing else
          }
          </Route>
          <Route path="/shareAdd/:add/:komKode/:komNr/:bbr" children={<updateStateUrl/>} />
          <Route path="/:table/:subject/:area/:time/:showHeader/:graphType" children={<ShowGraph/>} />
        </Switch>
      </Router>
    );
  }
}

function ShowGraph(props) {
  let { table, subject, area, time, showHeader, graphType } = useParams();
  return (
    <AutoGrapher
      table={table}
      data={subject}
      komKode={area}
      time={time}
      showHeader={showHeader}
      graphType={graphType}
    />
  )
}

export default App;
