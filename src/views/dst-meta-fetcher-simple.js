import React from "react";
import axios from "axios";
import AutoGrapherAdvanced from "./auto-graph-adv";

export default class DSTMetaFetcherSimple extends React.Component {
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
            graphType: "spline",
            graphTypesAvailable: 
                ["line","spline","stepLine","bars","area","splineArea",
                "stepArea","waterfall","column","scatter","bubble"]
        };
        
        this.handleTableSubmit = this.handleTableSubmit.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleSelectionsChange = this.handleSelectionsChange.bind(this);
        this.handleSelectionsSubmit = this.handleSelectionsSubmit.bind(this);

        this.createQuery = this.createQuery.bind(this);
        this.handleGraphTypeChange = this.handleGraphTypeChange.bind(this);

        
        this.onTimeValueChange = this.onTimeValueChange.bind(this);

        this.IsJsonString = this.IsJsonString.bind(this);
      }
    
    // Submit table
    handleTableSubmit(event){
        event.preventDefault();
        this.setState({
            loadingData: true,
            query: "",
            hasQuery: false
        });
        localStorage.setItem("tableID",this.state.tableID);
        this.getData()
    }

    // Handle the change of table. Should not update anything.
    handleTableChange(event) {
        this.setState({
            tableID: event.target.value,
            loadingData: true,
            hasQuery: false,
            query: "",
            queryTMP: ""
        });
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
            graphType: event.target.value
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
                            return <option key={elem.id} label={elem.label} value={elem.id}> {elem.text}</option>
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
                console.log("Reply from statbank")
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
            <div className="dst-fetcher">
                <p>Find tabeller på <a href="https://www.dst.dk/da/Statistik/emner">Danmarks statistik</a></p>
                <p>Foreslåede tabeller:</p>
                <ul>
                    <li>STRAF12</li>
                    <li>STRAF22</li>
                    <li>EJDSK3</li>
                </ul>
                <form onSubmit={this.handleTableSubmit}>
                    <label>
                        Tabel:  
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
                    <input type="submit" value="Opret graf" />
                </form>
                <form>
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
                    </form>
                <form>
                    <label>Graftype
                        <select name="graphType" onChange={this.handleGraphTypeChange} >
                            <option label="spline" value="spline"></option>
                            <option label="column" value="column"></option>
                            <option label="splineArea" value="splineArea"></option>
                        </select>
                    </label>
                </form>
                {JSON.stringify(this.state.query)}
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