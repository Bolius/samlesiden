import React from "react";

export default class LatestAddressList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
    
  handleClick = (e) => {
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
          <li 
            key={adds[i]} 
            data-add={adds[i]} 
            data-kom={koms[i]} 
            data-bbr={bbrs[i]} 
            data-kode={koder[i]}
            onClick={this.handleClick}
          >
            {adds[i]}
          </li>
        )
      }
    }
      
    return (
      <div>
        <h2>Seneste adresser:</h2>
        {(listItems.length > 0) &&
        <ul>
          {listItems}
        </ul>
        }
        {(listItems.length <= 0) &&
        <p>Ingen gemte adresser. Anvend adressefeltet til for at søge nye adresser.</p>
        }
      </div>
    );
  }
}