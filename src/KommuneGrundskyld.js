import React from 'react';

import CanvasJSReact from './canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GeneratePostRequest(a) {
  var req = {
    table: "EJDSK3",
    format: "JSONSTAT",
    variables: [
    {
      code: "OMRÅDE",
      values: [a]
    },
    {
      code: "TID",
      values: ["*"]
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
    console.log("Props.id = " + props.id)
    this.state = {
      id: props.id,
      name: ""
    };
  }

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: GeneratePostRequest(this.state.id)
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
		    itemclick: toggleDataSeries
	    },
	    toolTip:{
		    shared: true
	    },
			data: [{
        name: this.state.fam1Legend,
    		type: "spline",
        yValueFormatString: "###.###'.000' DKK",
    		showInLegend: true,
				dataPoints: this.state.fam1
			},{
        name: this.state.fam2Legend,
        showInLegend: true,
				type: "spline",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.fam2
			},{
        name: this.state.fam3Legend,
        showInLegend: true,
				type: "spline",
        label: "Et-familieshuse",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.fam3
			},{
        name: this.state.ejerLegend,
        showInLegend: true,
				type: "spline",
        label: "Et-familieshuse",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.ejer
			},{
        name: this.state.sommLegend,
        showInLegend: true,
				type: "spline",
        label: "Et-familieshuse",
        yValueFormatString: "###.###'.000' DKK",
				dataPoints: this.state.somm
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

function toggleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else{
		e.dataSeries.visible = true;
	}
	Grundskyld.render();
}

export default Grundskyld;
