import React from 'react';
import CanvasJSReact from '../canvasjs.react';
import {Link} from "react-router-dom";
import Loader from "../components/Loader";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class AutoGrapherAdvanced extends React.Component {
  state = {
    externalData: null,
    isLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.query !== state.query || props.graphType !== state.graphType) {
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
    this._loadAsyncData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData();
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }
  

  _loadAsyncData() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.props.query
    };

    fetch('https://api.statbank.dk/v1/data', requestOptions)
      .then(response => response.json())
      .then(data => {
        
        data = data.dataset

        // Get amount of kommuner for this data set
        var koms = ["samlet, Danmark"]
        if(data.dimension.hasOwnProperty("OMRÅDE")){
          koms = Object.values(data.dimension["OMRÅDE"].category.label)
        }
        var komsCount = koms.length

        // Get properties to show
        var ids = data.dimension.id.filter(e => {return e !== "Tid" & e !== "ContentsCode" && e !== "OMRÅDE"})
        
        // Get labels for each data set
        var xTmp = ids.map(e => {return Object.values(data.dimension[e].category.label)})
        
        var xLabels = [];
        function labelGen(out,a,b){
          if(a.constructor === Array){
            for(var i = 0; i < a.length; i++){
              labelGen(out,a[i],b)
            }
          } else {
            out.push(a + ", " + b)
          }
        }
        for(var i = 0; i < komsCount; i++){
          if(xTmp.length === 1){
            xLabels.push(xTmp[i] + ", " + koms[i])
          }
          for(var j = 1; j < xTmp.length; j++){
            labelGen(xLabels, xTmp[j], koms[i])
          }
        }
        


        var yValues = data.value

        var timestamps = Object.values(data.dimension.Tid.category.label)

        // Counts data series
        const objs = Object.keys(data.dimension).filter(e => {
          return e !== "Tid" && e !== "ContentsCode" && e !== "id" && e !== "size" && e !== "role"})
        
        // Accumulates data sets
        var dataSets = 0
        objs.forEach( e => {dataSets += Object.values(data.dimension[e].category.label).length}) 
        
        // Get size of each data set
        var dataSetSize = Object.values(data.dimension.Tid.category.index).length
        
        var points = []
        for (i = 0; i < (dataSets) ; i++){
          points.push([])
          for (j = 0; j < dataSetSize; j++){
            points[i].push({label: String(timestamps[j]), x:j, y: yValues[j+(i*dataSetSize)] })
          }
        }

        var dataset = []
        
        for (var k = 0; k < xLabels.length; k++){
          dataset.push({
            name: xLabels[k], // TODO
            dataPoints: points[k],
            yValueFormatString: "# ",
            type: this.props.graphType,
            showInLegend: true
          })
        }
        this.setState({ 
          isLoaded: true, 
          data: dataset,  
          externalData: "", 
          query: this.props.query,    
          graphType: this.props.graphType,     
          header: ["hej","meddig"]
        });

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

export default AutoGrapherAdvanced;
