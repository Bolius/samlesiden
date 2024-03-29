import React from "react";
import axios from "axios";
import AutoGrapherAdvanced from "../components/auto-graph-adv";

export default class DSTMetaFetcherAdv extends React.Component {
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
            selectedOption: "from",
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
    
     // Hanldes a selection change, any auto-generated field
     handleSelectionsChange(event) {
        event.preventDefault()
        let code = event.target.name;
        let values = [event.target.value];

        // Pushes new element to front
        const f = this.state.fields;
        console.log(f)
        f.unshift({code,values})
        // And remove duplicates, meaning 2nd occurence (old value) gets removed
        const uniqueArray = f.filter((e, index) => {
            return index === f.findIndex(obj => {
                return obj.code === e.code;
        })});
        this.changeTimeframe(uniqueArray, this.state.selectedOption)
        
    }

    // Submit to create query from selections
    handleSelectionsSubmit(event) {
        event.preventDefault();
        this.changeTimeframe(this.state.fields, this.state.selectedOption)   
    }

    // Change the graph type
    handleGraphTypeChange(event){
        this.setState({
            graphType: event.target.value,
            selectedOption: "to"
        })
    }

    onTimeValueChange(event) {
        this.setState({
            selectedOption: event.target.value
          });
        this.changeTimeframe(this.state.fields, event.target.value)
    }

    changeTimeframe(fields, token){
        const isTimeField = (element) => element.code === "Tid";
        const timeFieldIndex = this.state.fields.findIndex(isTimeField)
        var timeFieldValue = ""
        const expr = this.state.fields[timeFieldIndex].values[0].match(/[0-9]{4}(K[1-4])*/)[0]
        switch(token){
            case "from":
                timeFieldValue = ">=" + expr
                break
            case "to":
                timeFieldValue = "<=" + expr
                break
            case "between":
                timeFieldValue = "<=" + expr
                break
            default:
                console.log(token)
                break
        }
        fields[timeFieldIndex] = {code: "Tid", values: [timeFieldValue]}
        
        this.createQuery(fields)
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
        const graphOptions = this.state.graphTypesAvailable.map((elem) => {                            
            return <option key={elem} label={elem} value={elem}> {elem}</option>
        })
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
                    <div>
                        <input 
                            type="radio" 
                            value="from"
                            checked={this.state.selectedOption === "from"}
                            onChange={this.onTimeValueChange}
                            /> Fra og med valgt tid

                        <input 
                            type="radio" 
                            value="to" 
                            checked={this.state.selectedOption === "to"}
                            onChange={this.onTimeValueChange}
                            /> Op til og med valgt tid

                        <input 
                            type="radio" 
                            value="between" 
                            checked={this.state.selectedOption === "between"}
                            onChange={this.onTimeValueChange}
                            /> Mellem
                            </div>
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
                            {graphOptions}
                        </select>
                    </label>
                </form>
                {this.state.hasQuery ? 
                    <AutoGrapherAdvanced 
                        query={JSON.stringify(this.state.query)}
                        graphType={this.state.graphType}
                        includeLink={true}
                    />
                    :
                    ""
                }
            </div>
        )
    }
}