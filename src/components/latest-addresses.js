import React from "react";

export default class LatestAddressList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event){
    this.props.updateAddress(event)
  }


  render() {
    var listItems
    var input = []
    // Super dumt, men det virker
    if(this.props.addressList.length > 0){
      if(this.props.addressList.includes(";")){
        input = this.props.addressList.split(';')
      } else {
        input = [this.props.addressList]
      }
    }
    if (input.length > 0){
      listItems = input.map((elem) =>
        <li><a onClick={() => this.handleClick(elem)}>{elem}</a></li>
      );
    }
    return (
      <div>
        <h2>Seneste adresser:</h2>
        {(input.length > 0) &&
        <ul>
          {listItems}
        </ul>
        }
        {(input.length <= 0) &&
        <p>Ingen gemte adresser. Anvend adressefeltet til for at søge nye adresser.</p>
        }
      </div>
    );
  }
}