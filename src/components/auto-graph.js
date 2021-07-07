import React from 'react';
import CanvasJSReact from '../canvasjs.react';
import {Link} from "react-router-dom";
import Loader from "./Loader";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// TODO: Saml de her 3 arrays til 1 array
var nameVarsMap = [
  "indbrud_total",
  "indbrud_sigt",
  "indbrud_anm", 
  "grundskyld"
];

 var tmp = [
  "ANMSIGT",
  "ANMSIGT",
  "ANMSIGT",
  "EJENTYP"
]

var graphHeaders = [
  "Indbrud i private beboelser", 
  "Grundskyld pr. boligtype"
]

var vars = [];
vars[0] = [{code: "OVERTRÆD", values: ["1320"]},
           {code: "ANMSIGT",  values: ["*"]}]
vars[1] = [{code: "OVERTRÆD", values: ["1320"]},
           {code: "ANMSIGT",  values: ["*"]}]
vars[2] = [{code: "OVERTRÆD", values: ["1320"]},
           {code: "ANMSIGT",  values: ["*"]}]
vars[3] = [{code: "EJENTYP", values: ["2","3","4","7","8"]}]


function GeneratePostRequest(table, komKode, tid, varIndex) {
  tid = tid.replace("==","")
  var req = {
    table: table,
    format: "JSONSTAT",
    variables: [
      {
        code: "OMRÅDE",
        values: komKode
      },
      {
        code: "TID",
        values: [tid]
      }
    ]
  };
  if (vars && vars[varIndex]) {
    vars[varIndex].forEach(item => {req.variables.push(item)})
  }
  return JSON.stringify(req)
  
}

class AutoGrapher extends React.Component {
  state = {
    externalData: null,
    isLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.komKode !== state.komKode) {
      return {
        externalData: null,
        isLoaded: false
      };
    }
    // No state update necessary
    return null;
  }
  
  toggleDataSeries = this.toggleDataSeries.bind(this);

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.komKode);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  _loadAsyncData() {
    var varIndex = nameVarsMap.findIndex(item => {return item === this.props.data});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: GeneratePostRequest(this.props.table, this.props.komKode, this.props.time, varIndex)
    };

    fetch('https://api.statbank.dk/v1/data', requestOptions)
      .then(response => response.json())
      .then(data => {
        var v = data.dataset.value
        var axisLabels = Object.values(data.dataset.dimension[tmp[varIndex]].category.label)
        var name = Object.values(data.dataset.dimension.OMRÅDE.category.label)[0]
        var timestamps = Object.values(data.dataset.dimension.Tid.category.label)
        var dataSets = Object.keys(data.dataset.dimension[tmp[varIndex]].category.label).length
        var pointSize = data.dataset.dimension.size
        pointSize = pointSize[pointSize.length - 1]
        var points = []
        for (var i = 0; i <= dataSets - 1; i++){
          points.push([])
          for (var j = 0; j < pointSize; j++){
            points[i].push({label: String(timestamps[j]), x:j, y: v[j+(i*pointSize)] })
          }
        }

        var dataset = []
        for (var k = 0; k < dataSets; k++){
          dataset.push({
            name: axisLabels[k],
            yValueFormatString: "# ",
            dataPoints: points[k],
            type: this.props.graphType,
            showInLegend: true
          })
        }
        console.log(dataset)
        this.setState({ 
          isLoaded: true, 
          data: dataset, 
          name: name, 
          externalData: "", 
          komKode: this.props.komKode, 
          header: graphHeaders[varIndex]}
        );
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
      header = this.state.header
    }
    const options = {
			animationEnabled: true,
      title:{
				text: header
			},
      toolTip:{
        shared: true
      },
      legend:{
        cursor: "pointer",
        fontSize: 16,
        itemclick: this.toggleDataSeries
      },
      axisY:{
        valueFormatString:"#",
      },
			data: this.state.data
		}
		return (
		  <div>
        {!this.state.isLoaded ? <Loader /> :
			  <CanvasJSChart options = {options}
				  onRef={ref => this.chart = ref}
			  />
        }
        <Link to={"/"+this.props.table +"/" + this.props.data + "/" + 
                    this.props.komKode + "/" + this.props.time + "/" + 
                    this.props.showHeader + "/" + this.props.graphType}>Link til denne graf</Link>
		  </div>
		);
  }
}

export default AutoGrapher;
