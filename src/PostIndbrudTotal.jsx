import React from 'react';

import CanvasJSReact from './canvasjs.react';
// var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function GeneratePostRequest(year) {
  var req = {
    // Straf12 for sæsonkorrigeret, Straf10 for faktiske
    table: 'STRAF12',
    format: 'JSONSTAT',
    valuePresentation: 'Code',
    timeOrder: 'Ascending',
    variables: [
      {
        code: 'OVERTRÆD',
        placement: 'Head',
        values: [
          '1320'
        ]
      },
      {
        code: 'TID',
        values: [
          year
        ]
      }
    ]
  };
  return JSON.stringify(req)

}

class PostIndbrudTotal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  componentDidMount() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: GeneratePostRequest('<=2020K4')
    };

    fetch('https://api.statbank.dk/v1/data', requestOptions)
      .then(response => response.json())
      .then(data => {
        var v = data.dataset.value

        var names = Object.values(data.dataset.dimension.Tid.category.label)

        var res = []
        for (var i = 0; i <= v.length; i++){
          res.push({label: String(names[i]), y: v[i] })
        }

        this.setState({ data: res });
      });
  }

  render(){
    const options = {
			animationEnabled: true,
      title:{
				text: "Inbrud pr kvartal, Danmark"
			},
      axisY:{
        valueFormatString:"#'.'###",
      },
			data: [{
				type: "spline",
        yValueFormatString: "#'.'###",
				dataPoints: this.state.data
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

export default PostIndbrudTotal;
