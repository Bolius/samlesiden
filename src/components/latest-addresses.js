// This module create a clickable list of latests visisted addresses
// Clicking an address should update the current address

import React from "react";

export default class LatestAddressList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
    
  handleClick = (e) => {
    e.preventDefault();
    this.props.setAddress(
      e.target.dataset.kode,
      e.target.dataset.kom,
      e.target.dataset.add,
      e.target.dataset.bbr,
    )
  }
  
  render(){
    var listItems = [];
    if(this.props.addressList.length > 0){
      var adds = this.props.addressList
      var koms = this.props.komList
      var bbrs = this.props.bbrList
      var koder = this.props.kodeList
      
      for (var i = 0; i < adds.length; i++){
        listItems.push(
          <React.Fragment>
            <a key={adds[i]} className="latest-address" href=""
              data-add={adds[i]} 
              data-kom={koms[i]} 
              data-bbr={bbrs[i]} 
              data-kode={koder[i]}
              onClick={this.handleClick}
              >
                {adds[i]}
            </a>{i < adds.length - 1 ? <span>, </span> : ''}
            </React.Fragment>
        )
      }
    }
      
    return (
      <React.Fragment>
        <p>
        Seneste adresser:&nbsp;
       {listItems.length > 0 ? listItems : ''}
        {(listItems.length <= 0) &&
          <React.Fragment>Ingen gemte adresser. Anvend adressefeltet til for at søge nye adresser.</React.Fragment>
        }
        </p>
      </React.Fragment>
    );
  }
}