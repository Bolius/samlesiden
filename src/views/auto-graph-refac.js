import React from 'react';
import CanvasJSReact from '../canvasjs.react';
import {Link} from "react-router-dom";
import Loader from "./../components/Loader";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class AutoGrapherRefac extends React.Component {
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
      this._loadAsyncData(this.props.query);
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

        var ids = data.dimension.id.filter(e => {return e !== "Tid" & e !== "ContentsCode" && e !== "OMRÅDE"})
        var xLabels = ids.map(e => {return Object.values(data.dimension[e].category.label)})[0]
        
        var yValues = data.value

        var timestamps = Object.values(data.dimension.Tid.category.label)

        // Counts data sets. Could possibly break if multiple kommuner is selected.
        var dataSets = xLabels.length
        
        // Get size of each data set
        var dataSetSize = Object.values(data.dimension.Tid.category.index).length

        var points = []
        for (var i = 0; i <= dataSets - 1; i++){
          points.push([])
          for (var j = 0; j < dataSetSize; j++){
            points[i].push({label: String(timestamps[j]), x:j, y: yValues[j+(i*dataSetSize)] })
          }
        }

        var dataset = []
        for (var k = 0; k < dataSets; k++){
          dataset.push({
            name: xLabels[k],
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
          //header: graphHeaders[varIndex]
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

export default AutoGrapherRefac;
