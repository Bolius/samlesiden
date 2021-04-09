import React from 'react';

import CanvasJSReact from '../canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GeneratePostRequest(komKode, tid) {
  var req = {
    table: "STRAF22",
    format: "JSONSTAT",
    variables: [
      {
        code: "OMRÅDE",
        values: [komKode]
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

class KommuneIndbrud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      komKode: this.props.komKode,
      time: this.props.time,
      name: ""
    };
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
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
        var name = Object.values(data.dataset.dimension.OMRÅDE.category.label)[0]
        var names = Object.values(data.dataset.dimension.Tid.category.label)

        var anm = []
        var sig = []
        var j = v.length / 2
        for (var i = 0; i <= j - 1; i++){
          anm.push({label: String(names[i]), x:i, y: v[i] })
          sig.push({label: String(names[i]), x:i, y: v[j + i] })
        }

        this.setState({ anm: anm, sig: sig, name: name });
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
    var header = "";
    if (this.props.showHeader === "true"){
      header = "Anmeldelser og sigtelser for indbrud pr. år i " + this.state.name + " kommune"; 
    }
    const options = {
			animationEnabled: true,
      title:{
				text: header
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
        name: "Anmeldelser",
        yValueFormatString: "# anmeldelser",
				dataPoints: this.state.anm,
    		showInLegend: true
			  },
        {
        name: "Sigtelser",
        yValueFormatString: "# sigtelser",
				dataPoints: this.state.sig,
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

export default KommuneIndbrud;
