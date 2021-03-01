import React from 'react';
import { CSVReader, readString } from "react-papaparse";

import raw from "raw.macro";

import CanvasJSReact from './canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ParcelPriser = raw("./data/ParcelPrisKvm.csv");
const EjerPriser = raw("./data/EjerlejlPrisKvm.csv");
const FritidsPriser = raw("./data/FritidsPrisKvm.csv");

class KommuneBoligpriser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      out: [],
      name: ""
    };
  }

    componentDidMount() {
        var csvParcel = readString(ParcelPriser, {header: true, delimiter: ";"})
        var csvFritids = readString(FritidsPriser, {header: true, delimiter: ";"})
        var csvEjer = readString(EjerPriser, {header: true, delimiter: ";"})
        var city = csvParcel.data[5]

        var ParcelPrices = []
        var FritidsPrices = []
        var EjerPrices = []

        var years = Object.keys(city);
        var ParcelValues = Object.values(csvParcel.data[36]);
        var FritidsValues = Object.values(csvFritids.data[36]);
        var EjerValues = Object.values(csvEjer.data[36]);
        for (var i = 2; i < years.length; i++){
            ParcelPrices.push({label: years[i], y: parseInt(ParcelValues[i])})
            FritidsPrices.push({label: years[i], y: parseInt(FritidsValues[i])})
            EjerPrices.push({label: years[i], y: parseInt(EjerValues[i])})
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
        console.log(this.state.out)
        const options = {
			animationEnabled: true,
            title:{
				text: "Boligpriser pr. år i " + this.state.name + " kommune"
			},
            legend:{
                  cursor: "pointer",
                  fontSize: 16,
                  itemclick: toggleDataSeries
              },
              toolTip:{
                  shared: true
              },
            axisY:{
                valueFormatString:"#",
            },
			data: [{
                name: this.state.ParcelLegend,
                type: "spline",
                yValueFormatString: "# DKK",
                showInLegend: true,
                dataPoints: this.state.Parcel
            },{
                name: this.state.EjerLegend,
                showInLegend: true,
                type: "spline",
                yValueFormatString: "# DKK",
                dataPoints: this.state.Ejer
            },{
                name: this.state.FritdsLgend,
                showInLegend: true,
                type: "spline",
                yValueFormatString: "# DKK",
                dataPoints: this.state.Fritid
            }]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
		</div>
		);
    }
}



export default KommuneBoligpriser;

function toggleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else{
		e.dataSeries.visible = true;
	}
	this.forceUpdate();
}
