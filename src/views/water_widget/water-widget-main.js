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
  
  function setData (data) {
    setHouseData(data);
    setLoadingHouseData(false);
  }

  useEffect(() => {
    setLoadingHouseData(true);
    
    // "Gracefull" cancellation if user switches tabs
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    
    axios.get(
      "https://api.dataforsyningen.dk/adresser?q=" + props.navn, {
        cancelToken: source.token
      })
      .then(response => {
        getFloodData(response.data[0].id,setData);
      })
      .catch(function (thrown) {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        }
      })
    
    return function cleanup() {
      source.cancel('Operation canceled by the user.');
    };

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