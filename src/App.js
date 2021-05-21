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

import trackEvent from "./components/action-logger.js";

import AdressSelect from "./components/adress-select.js";
import KommuneSelector from "./components/KommuneSelector.js";

import LatestAddressList from "./components/latest-addresses.js"
import Grafkonfigurator from './components/Grafkonfigurator';

import WaterComesModule from "./views/water_widget/water-widget-main.js";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.setKomKode = this.setKomKode.bind(this);
    this.state = {
      komKode: localStorage.getItem('komKode') || '101',
      komNavn: localStorage.getItem('komNavn') || 'København',
      address: localStorage.getItem('address') || '',
      hasAddress: (localStorage.getItem("latestAdd") != null),
      hasKomData: (localStorage.getItem("latestKom") != null),
      hasBBRData: (localStorage.getItem("latestBBR") != null),
      latestAdd: localStorage.getItem("latestAdd") || [],
      latestBBR: localStorage.getItem("latestBBR") || [],
      houseData: {},
    };
  }

  stringify = (arr) => {
    const reducer = (accumulator, currentValue) => accumulator + ";" + String(currentValue);
    return arr.reduce(reducer);
  }


  setKomKode = (kode,navn) => {
    this.setState({
      hasKomData: true,
      hasAddress: false,
      komKode: kode,
      komNavn: navn
    });
    localStorage.setItem('komKode', kode);
    localStorage.setItem('komNavn', navn);
  }

  setAddress = (kode,kom, add, bbr) => {
    this.setKomKode(kode,kom)
    this.setState({
      hasAddress: true,
      address: add,
      komNavn: kom
    });
    localStorage.setItem("address",add)

    var adds = []
    if (localStorage.getItem("latestAdd") === null) {
      adds = [add];
    } else {
      adds = localStorage.getItem("latestAdd").split(';')
      adds.unshift(add.toString())
      adds = [...new Set(adds)].slice(0,5)
    }
    localStorage.setItem('latestAdd', this.stringify(adds));
    
    var bbrs = []
    if (localStorage.getItem("latestBBR") === null) {
      bbrs = [bbr];
    } else {
      bbrs = localStorage.getItem("latestBBR").split(';')
      bbrs.unshift(bbr.toString())
      bbrs = [...new Set(bbrs)].slice(0,5)
    }
    localStorage.setItem('latestBBR', this.stringify(bbrs));

    var koms = []
    if (localStorage.getItem("latestKom") === null) {
      koms = [kode];
    } else {
      koms = localStorage.getItem("latestKom").split(';')
      koms.unshift(kode.toString())
      koms = [...new Set(koms)].slice(0,5)
    }
    this.setState({latesKom: koms,latestAdd: adds});
    localStorage.setItem('latestKom', this.stringify(koms));
  }

  updateAddress = (add) => {  
    this.setState({
      address: add,
      hasAddress: true
    });
    localStorage.setItem("address",add)
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

  render() {
    console.log(this.state)
    return (
      <div>
        <p> {this.state.message} </p>
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
                    updateAddress={this.updateAddress} />
                </div>
                <div id="address-show-field">
                  <h2>Viser oplysninger baseret på følgende oplysninger:</h2>
                  <div>
                    {this.state.hasKomData && <p>{this.state.komNavn}, Kommunekode: {this.state.komKode}</p>}
                    {this.state.hasAddress && <p>{this.state.address}</p>}
                  </div>
                </div>
              </>
              <Tabs>
                <div label="Kommunebaseret data">
                  <AutoGrapher
                    table={"STRAF22"}
                    komKode={this.state.komKode}
                    data={"indbrud"}
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
            <Route path="/:table/:subject/:area/:time/:showHeader/:graphType" children={<ShowGraph/>} />
          </Switch>
        </Router>
      </div>
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
