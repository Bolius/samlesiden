import React, { useState, useEffect } from "react";
import axios from "axios";
import { StepContent } from "@material-ui/core";

export default class DSTMetaFetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingData: true,
            querySelected: false,
            query: "",
            tableID: localStorage.getItem("tableID") || "",
            content: null,
            request: null
        };
        
        this.handleTableSubmit = this.handleTableSubmit.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
    handleTableSubmit(event){
        this.setState({loadingData: true});
        this.getData()
        localStorage.setItem("tableID",this.state.tableID);
        event.preventDefault();
    }

    handleTableChange(event) {
        this.setState({tableID: event.target.value});
      }
    
    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
        
    }

    handleSubmit(event) {
        console.log(this.state)
        var variables = this.state.content.map((elem) => {
            return elem.key;
        })
        console.log(variables)
        event.preventDefault();
    }

    getData(){
        const options = {
            method: 'post',
            url: 'https://api.statbank.dk/v1/tableinfo',
            data: {table: String(this.state.tableID)},
            transformResponse: [(data) => {
                data = JSON.parse(data)
                
                var vars = data.variables

                function optionGen(section) {
                    return (
                        section.map((elem) => {                            
                            return <option key={elem.id} label={elem.label}>{elem.text}</option>
                        })
                    )
                }

                const selections = vars.map((elem) => {
                    return (
                        <label key={elem.id}>{elem.id}
                            <select name={elem.id} onChange={this.handleChange} >
                                {optionGen(elem.values)}
                            </select>
                        </label>
                    )
                  }
                );
                
                this.setState({
                    loadingData : false,
                    content: selections
                })
            }]
        };
          
        // send the request
        axios(options);
        console.log("getData(): ", this.state)
    }

    componentDidMount() {
        if(this.state.tableID != ""){
            this.getData();
        }
    }

    render(){
        return (
            <div>
                {this.state.tableID ? "Sidste tabel: " + this.state.tableID : ""}
                <form onSubmit={this.handleTableSubmit}>
                    <label>
                        Tabel 
                        <input type="text" value={this.state.tableID} onChange={this.handleTableChange} />
                    </label>
                    <input type="submit" value="Hent tabel" />
                </form>
                <form>
                {!this.state.loadingData ?
                    this.state.content
                    :
                    ""
                }
                <input type="submit" value="Submit" />
                {this.state.querySelected ?
                    this.state.query :
                    ""
                }
                </form>
            </div>
        )
    }
}