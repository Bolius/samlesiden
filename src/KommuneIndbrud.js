import React from 'react';

import CanvasJSReact from './canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GeneratePostRequest(a) {
  var req = {
    table: "STRAF22",
    format: "JSONSTAT",
    variables: [
      {
        code: "OMRÅDE",
        values: [a]
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
        values: ["*"]
      }
    ]
  };
  return JSON.stringify(req)

}

class KommuneIndbrud extends React.Component {
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

  render(){
    const options = {
			animationEnabled: true,
      title:{
				text: "Anmeldelser og sigtelser for indbrud pr. år i " + this.state.name + " kommune"
			},
      axisY:{
        valueFormatString:"#",
      },
			data: [{
        yValueFormatString: "# sigtelser",
				dataPoints: this.state.sig
			},{
        yValueFormatString: "# anmeldelser",
				dataPoints: this.state.anm
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

export default KommuneIndbrud;
