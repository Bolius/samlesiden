import React from "react";
import axios from "axios";
import AutoGrapherAdvanced from "../views/auto-graph-adv";

export default class DSTMetaFetcher extends React.Component {
    constructor(props) {
        super(props);
        var q = localStorage.getItem("query") || ""
        this.state = {
            loadingData: true,
            hasQuery: false,
            query: "",
            queryTMP: q,
            tableID: localStorage.getItem("tableID") || "",
            content: null,
            request: null,
            fields: [],
            graphType: "column",
            graphTypesAvailable: 
                ["line","spline","stepLine","bars","area","splineArea",
                "stepArea","waterfall","column","scatter","bubble"]
        };
        
        this.handleTableSubmit = this.handleTableSubmit.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
        this.handleSelectionsChange = this.handleSelectionsChange.bind(this);
        this.handleSelectionsSubmit = this.handleSelectionsSubmit.bind(this);

        this.createQuery = this.createQuery.bind(this);
        this.handleGraphTypeChange = this.handleGraphTypeChange.bind(this);

        this.onChangeTimeValue = this.onChangeTimeValue.bind(this);
        this.onTimeValueChange = this.onTimeValueChange.bind(this);

        this.IsJsonString = this.IsJsonString.bind(this);
      }
    
    handleTableSubmit(event){
        event.preventDefault();
        this.setState({
            loadingData: true,
            query: "",
            hasQuery: false
        });
        this.getData()
        localStorage.setItem("tableID",this.state.tableID);
    }

    handleTableChange(event) {
        this.setState({
            tableID: event.target.value,
            loadingData: true,
            hasQuery: false,
            query: "",
            queryTMP: ""
        });
    }

    handleQueryChange(event){
        this.setState({
            queryTMP: event.target.value,
            hasQuery: false,
            hasQueryTMP: true
        });
        localStorage.setItem("query",event.target.value);
    }

    handleQuerySubmit(event){
        event.preventDefault();
        if(this.IsJsonString(this.state.queryTMP)){
            
            this.setState({
                hasQuery: true,
                hasQueryTMP: false,
                query: JSON.parse(this.state.queryTMP)
            });
        } else {
            alert("Ugyldigt input")
        }
    }

    createQuery(uniqueFields){
        var json = {
            table: this.state.tableID,
            format: "JSONSTAT",
            variables: []
          };
        uniqueFields.forEach(item => {json.variables.push(item)})
        this.setState({
            fields: uniqueFields,
            query: json, 
            queryTMP: JSON.stringify(json), 
            hasQuery: true
        });
        localStorage.setItem("query", JSON.stringify(json));
    }
    
    handleSelectionsChange(event) {
        event.preventDefault()
        let code = event.target.name;
        let values = [event.target.value];

        // Pushes new element to front
        const f = this.state.fields;
        f.unshift({code,values})
        // And remove duplicates, meaning 2nd occurence (old value) gets removed
        const uniqueArray = f.filter((e, index) => {
            return index === f.findIndex(obj => {
                return obj.code === e.code;
        })});
        this.createQuery(uniqueArray)
        
    }

    // Submit to create query from selections
    handleSelectionsSubmit(event) {
        event.preventDefault();
        this.createQuery(this.state.fields)
    }

    handleGraphTypeChange(event){
        this.setState({
            graphType: event.target.value
        })
    }

    onChangeTimeValue(event) {
        event.preventDefault()
        var fields = this.state.fields
        const isTimeField = (element) => element.code === "Tid";
        const timeFieldIndex = this.state.fields.findIndex(isTimeField)
        var timeFieldValue = ""
        switch(event.target.value){
            case "from":
                timeFieldValue = ">=" + this.state.fields[timeFieldIndex].values[0].match(/(\d+)/)[0]
                break
            case "to":
                timeFieldValue = "<=" + this.state.fields[timeFieldIndex].values[0].match(/(\d+)/)[0]
                break
            case "between":
                timeFieldValue = "<=" + this.state.fields[timeFieldIndex].values[0].match(/(\d+)/)[0]
                break
            default:
                break
        }
        fields[timeFieldIndex] = {code: "Tid", values: [timeFieldValue]}
        this.setState({fields: fields})
        this.createQuery(this.state.fields)
    }

    onTimeValueChange(event) {
        this.setState({
            selectedOption: event.target.value
          });
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    getData(){
        const options = {
            method: 'post',
            url: 'https://api.statbank.dk/v1/tableinfo',
            data: {table: String(this.state.tableID)},
            transformResponse: [(data) => {
                data = JSON.parse(data)
                
                var vars = data.variables
                var firstRows = []
                // Generate options from elem values
                function optionGen(section) {
                    return (
                        section.map((elem) => {                            
                            return <option key={elem.id} label={elem.label} value={elem.id}>({elem.id}) {elem.text}</option>
                        })
                    )
                }

                const selections = vars.map((elem) => {
                    var json = {
                        code: elem.id,
                        values: [elem.values[0].id]
                    }
                    firstRows.push(json)
                    return (
                        <div>
                            <label key={elem.id}>{elem.id}
                                <select name={elem.id} onChange={this.handleSelectionsChange} >
                                    {optionGen(elem.values)}
                                </select>
                            </label>
                            {elem.id === "Tid" ? 
                            <div onChange={this.onChangeTimeValue}>
                                <input 
                                    type="radio" 
                                    value="from" 
                                    name="time" 
                                    checked={this.state.selectedOption === "from"}
                                    onChange={this.onTimeValueChange}
                                    /> Fra og med valgt tid

                                <input 
                                    type="radio" 
                                    value="to" 
                                    name="time" 
                                    checked={this.state.selectedOption === "to"}
                                    onChange={this.onTimeValueChange}
                                    /> Op til og med valgt tid

                                <input 
                                    type="radio" 
                                    value="between" 
                                    name="time" 
                                    checked={this.state.selectedOption === "between"}
                                    onChange={this.onTimeValueChange}
                                    /> Mellem
                            </div> 
                            : ""} 
                        </div>
                    )
                  }
                );
                this.setState({
                    loadingData : false,
                    content: selections,
                    fields: firstRows,
                    hasQuery: false
                })
            }]
        };
          
        // send the request
        axios(options);
    }

    componentDidMount() {
        if(this.state.tableID !== ""){
            this.getData();
        }
    }

    render(){
        return (
            <div>
                <p>Foreslåede tabeller:</p>
                <ul>
                    <li>STRAF12</li>
                    <li>STRAF22</li>
                    <li>EJDKS3</li>
                </ul>
                <form onSubmit={this.handleTableSubmit}>
                    <label>
                        Tabel 
                        <input type="text" value={this.state.tableID} onChange={this.handleTableChange} />
                    </label>
                    <input type="submit" value="Hent tabel" />
                </form>
                <form onSubmit={this.handleSelectionsSubmit}>
                    {!this.state.loadingData ?
                        this.state.content
                        :
                        ""
                    }
                    <input type="submit" value="Opret query" />
                </form>
                <form onSubmit={this.handleQuerySubmit}>
                    <textarea 
                        value={this.state.queryTMP} 
                        onChange={this.handleQueryChange} />
                    <input type="submit" value="Opdater graf" />
                </form>
                <form>
                    <label>Graftype
                        <select name="graphType" onChange={this.handleGraphTypeChange} >
                            <option label="column" value="column"></option>
                            <option label="spline" value="spline"></option>
                            <option label="splineArea" value="splineArea"></option>
                        </select>
                    </label>
                </form>
                {this.state.hasQuery ? 
                    <AutoGrapherAdvanced 
                        query={JSON.stringify(this.state.query)}
                        graphType={this.state.graphType}
                    />
                    :
                    ""
                }
            </div>
        )
    }
}