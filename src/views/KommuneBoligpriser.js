import React from 'react';
import { readString } from "react-papaparse";

import raw from "raw.macro";

import CanvasJSReact from '../canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ParcelPriser = raw("../data/ParcelPrisKvm.csv");
const EjerPriser = raw("../data/EjerlejlPrisKvm.csv");
const FritidsPriser = raw("../data/FritidsPrisKvm.csv");


class KommuneBoligpriser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.komKode,
      out: [],
      name: ""
    };
    this.getCity = this.getCity.bind(this);
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
  }

  getCity(elem){
    return elem.id === this.state.id;
  }

  toggleDataSeries(e){
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else{
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}

  componentDidMount() {
    var csvParcel = readString(ParcelPriser, {header: true, delimiter: ";",transformHeader: h => h.trim()})
    var csvFritids = readString(FritidsPriser, {header: true, delimiter: ";",transformHeader: h => h.trim()})
    var csvEjer = readString(EjerPriser, {header: true, delimiter: ";",transformHeader: h => h.trim()})

    var data = JSON.parse(JSON.stringify(csvParcel.data));
    const city = data.findIndex(this.getCity);

    var ParcelPrices = []
    var FritidsPrices = []
    var EjerPrices = []

    var years = Object.keys(data[city]);
    

    var reqYear = this.props.time
    // To make up for user error:
    if (!reqYear.includes("K")){
      reqYear = reqYear + "K1"
    }
    // Create range of years based on request
    var year = parseInt(reqYear.substring(2,8).replace('K',''))
    if (reqYear.includes(">=")){
      years = years.filter(y => parseInt(y.replace('K','')) >= year)
    } else if (reqYear.includes("<=")){
      years = years.filter(y => parseInt(y.replace('K','')) <= year)
    } else if (reqYear.includes("=")){
      years = years.filter(y => parseInt(y.replace('K','')) === year)
    }
    
    
    var ParcelValues = Object.values(csvParcel.data[city]);
    var FritidsValues = Object.values(csvFritids.data[city]);
    var EjerValues = Object.values(csvEjer.data[city]);
    for (var i = 0; i < years.length; i++){
      ParcelPrices.push({label: years[i], y: parseInt(ParcelValues[i+2])})
      FritidsPrices.push({label: years[i], y: parseInt(FritidsValues[i+2])})
      EjerPrices.push({label: years[i], y: parseInt(EjerValues[i+2])})
    }


    this.setState({
      Parcel:ParcelPrices,
      Fritid:FritidsPrices,
      Ejer:EjerPrices,
      ParcelLegend: "Parcelhuse",
      FritdsLgend: "Fritidshuse",
      EjerLegend:"Ejerlejligheder",
      name: ParcelValues[1]
    })
  };


  render(){
    const options = {
		  animationEnabled: true,
      title:{
			  text: "Boligpriser i " + this.state.name + " kommune"
		  },
      legend:{
        cursor: "pointer",
        fontSize: 16,
        itemclick: this.toggleDataSeries
      },
      toolTip:{
        shared: true
      },
      axisY:{
        valueFormatString:"#",
      },
			data: [{
        name: this.state.ParcelLegend,
        type: this.props.graphType,
        yValueFormatString: "# DKK",
        showInLegend: true,
        dataPoints: this.state.Parcel
      },{
        name: this.state.EjerLegend,
        showInLegend: true,
        type: this.props.graphType,
        yValueFormatString: "# DKK",
        dataPoints: this.state.Ejer
      },{
        name: this.state.FritdsLgend,
        showInLegend: true,
        type: this.props.graphType,
        yValueFormatString: "# DKK",
        dataPoints: this.state.Fritid
      }]
    }

		return (
		<div>
			<CanvasJSChart options = {options}
			   onRef={ref => this.chart = ref}
			/>
		</div>
		);
  }
}



export default KommuneBoligpriser;
