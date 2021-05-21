import React, { useState, useEffect } from "react";
import axios from "axios";
import MapBox from "./components/map-box.js";
import ActionHandler from "./action-handler.js";

import DataBasis from "./components/data-basis.js";
import getFloodData from "./data-handlers/get-flood-data.js";
import Loader from "../../components/Loader";

export default function WaterComesModule(props){
  const [isLoadingHouseData, setLoadingHouseData] = useState(true);
  const [houseData, setHouseData] = useState();
  const [address, setAddress] = useState(props.navn);
  
  function setData (data) {
    setHouseData(data);
    setLoadingHouseData(false);
  }

  useEffect(() => {
    setAddress(props.navn)
    setLoadingHouseData(true);
    axios.get("https://api.dataforsyningen.dk/adresser?q=" + props.navn)
      .then(response => {
        getFloodData(response.data[0].id,setData);
      })
  }, [props.navn]);

  return (
    <div>
      {!isLoadingHouseData ?   
        <>
        <MapBox
          address={props.navn}
          isApartment={props.isAppartment}
          reset={props.reset}
          showModal={props.toggleDataModal}
        />
        <ActionHandler dangers={houseData} />
        <DataBasis showModal={props.toggleDataModal} />
        </>
      :
        <Loader /> 
      }
    </div>
  );
  
}