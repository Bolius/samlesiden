import React from 'react';

import CanvasJSReact from '../canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GeneratePostRequest(area,time) {
  time = time.replace("==","")
  var req = {
    table: "EJDSK3",
    format: "JSONSTAT",
    variables: [
    {
      code: "OMRÅDE",
      values: [area]
    },
    {
      code: "TID",
      values: [time]
    },
    {
      code: "EJENTYP",
      values: ["2","3","4","7","8"]
    }]
  };
  return JSON.stringify(req)

}

class Grundskyld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      komKode: this.props.komKode,
      time: this.props.time,
      name: ""
    };
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
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
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: GeneratePostRequest(this.state.komKode, this.state.time)
    };

    fetch('https://api.statbank.dk/v1/data', requestOptions)
      .then(response => response.json())
      .then(data => {
        var v = data.dataset.value

        var title = Object.values(data.dataset.dimension.OMRÅDE.category.label)[0]

        var labels = data.dataset.dimension.EJENTYP.category.label

        var years = Object.keys(data.dataset.dimension.Tid.category.index)

        var fam1 = []
        var fam2 = []
        var fam3 = []
        var ejer = []
        var somm = []

        for (var i = 0; i < years.length; i++){
          fam1.push({label: String(years[i]), y:v[i+0*years.length]})
          fam2.push({label: String(years[i]), y:v[i+1*years.length]})
          fam3.push({label: String(years[i]), y:v[i+2*years.length]})
          ejer.push({label: String(years[i]), y:v[i+3*years.length]})
          somm.push({label: String(years[i]), y:v[i+4*years.length]})
        }

        this.setState({
          fam1: fam1, fam1Legend: labels["2"],
          fam2: fam2, fam2Legend: labels["3"],
          fam3: fam3, fam3Legend: labels["4"],
          ejer: ejer, ejerLegend: labels["7"],
          somm: somm, sommLegend: labels["8"],
          title: title });
      });
  }

  render(){
    const options = {
			animationEnabled: true,
      title:{
				text: "Grundskyld i " + this.state.title + " kommune"
			},
      legend:{
		    cursor: "pointer",
		    fontSize: 16,
		    itemclick: this.toggleDataSeries
	    },
	    toolTip:{
		    shared: true
	    },
			data: [{
        legendMarkerType: "circle",
        name: this.state.fam1Legend,
    		type: this.props.graphType,
        yValueFormatString: "###.###'.000' DKK",
    		showInLegend: true,
				dataPoints: this.state.fam1
			},{
        name: this.state.fam2Legend,
        showInLegend: true,
				type: this.props.graphType,
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.fam2
			},{
        name: this.state.fam3Legend,
        showInLegend: true,
				type: this.props.graphType,
        label: "Et-familieshuse",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.fam3
			},{
        name: this.state.ejerLegend,
        showInLegend: true,
				type: this.props.graphType,
        label: "Et-familieshuse",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.ejer
			},{
        name: this.state.sommLegend,
        showInLegend: true,
				type: this.props.graphType,
        label: "Et-familieshuse",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.somm
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

export default Grundskyld;
