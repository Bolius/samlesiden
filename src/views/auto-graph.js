import React from 'react';

import CanvasJSReact from '../canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GeneratePostRequest(komKode, tid) {
  tid = tid.replace("==","")
  var req = {
    table: "STRAF22",
    format: "JSONSTAT",
    variables: [
      {
        code: "OMRÅDE",
        values: komKode.split(",")
      },
      {
        code: "OVERTRÆD",
        values: ["1320"]
      },
      {
        code: "ANMSIGT",
        values: ["*"]
      },
      {
        code: "TID",
        values: [tid]
      }
    ]
  };
  console.log(JSON.stringify(req))
  return JSON.stringify(req)

}

class AutoGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.komKode,
      name: ""
    };
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
  }

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: GeneratePostRequest(
        this.props.table,
        decodeURI(this.props.varset),
        this.props.area,
        this.props.time)
    };

    fetch('https://api.statbank.dk/v1/data', requestOptions)
      .then(response => response.json())
      .then(data => {
        var v = data.dataset.value
        var name = Object.values(data.dataset.dimension.OMRÅDE.category.label)[0]
        var names = Object.values(data.dataset.dimension.Tid.category.label)

        var anm = []
        var j = v.length
        for (var i = 0; i <= j - 1; i++){
          anm.push({label: String(names[i]), x:i, y: v[i] })
        }

        this.setState({ anm: anm, name: name });
      });
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

  render(){
    const options = {
			animationEnabled: true,
      title:{
				text: "Anmeldelser og sigtelser for indbrud pr. år i " + this.state.name + " kommune"
			},
      legend:{
        cursor: "pointer",
        fontSize: 16,
        itemclick: this.toggleDataSeries
      },
      axisY:{
        valueFormatString:"#",
      },
			data: [{
        yValueFormatString: "# anmeldelser",
				dataPoints: this.state.anm,
    		showInLegend: true
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

export default AutoGraph;
